import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-response';
import Anthropic from '@anthropic-ai/sdk';

// POST /api/websites/projects/[id]/generate-code - Generate website code using AI
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'websites', 'update')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { framework = 'react' } = body;

    // Get the project
    const projects = await query(
      'SELECT * FROM website_projects WHERE id = $1',
      [params.id]
    );

    if (projects.length === 0) {
      return notFoundResponse('Project not found');
    }

    const project = projects[0];

    if (!project.wireframe_data) {
      return errorResponse('No wireframe found. Please generate a wireframe first.');
    }

    // Initialize Anthropic client
    if (!process.env.CLAUDE_API_KEY) {
      return errorResponse('Claude API key not configured', 500);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const wireframeData = typeof project.wireframe_data === 'string'
      ? JSON.parse(project.wireframe_data)
      : project.wireframe_data;

    const responsesText = project.responses
      .map((r: any) => `Q: ${r.question}\nA: ${Array.isArray(r.answer) ? r.answer.join(', ') : r.answer}`)
      .join('\n\n');

    const prompt = `You are a professional web developer. Generate a complete, production-ready ${framework} website based on the following specifications.

QUESTIONNAIRE RESPONSES:
${responsesText}

WIREFRAME STRUCTURE:
${JSON.stringify(wireframeData, null, 2)}

Generate a complete website with the following requirements:
1. ${framework === 'react' ? 'Modern React with functional components and hooks' : framework === 'next' ? 'Next.js App Router with server components' : 'Clean semantic HTML5'}
2. Responsive design using Tailwind CSS
3. Modern, professional styling that matches the requested design style
4. Fully functional navigation
5. SEO optimized with proper meta tags
6. Accessible (WCAG compliant)
7. Contact forms with validation
8. Smooth animations and transitions

Return a JSON object with this structure:
{
  "files": [
    {
      "path": "path/to/file",
      "content": "file content here",
      "language": "javascript|typescript|html|css"
    }
  ],
  "dependencies": [
    {
      "name": "package-name",
      "version": "^1.0.0",
      "type": "dependency|devDependency"
    }
  ]
}

Generate all necessary files for a complete, working website. Include:
- Main page components/files
- Reusable components
- Styling files
- Configuration files (package.json, tailwind.config.js, etc.)
- README with setup instructions

Make the code clean, well-organized, and production-ready.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return errorResponse('Failed to generate valid code structure', 500);
    }

    const codeData = JSON.parse(jsonMatch[0]);

    // Save generated code to database
    const generatedCode = await query(
      `INSERT INTO generated_code (
        project_id, framework, files, dependencies, generated_by, build_status
      )
      VALUES ($1, $2, $3, $4, 'claude', 'success')
      RETURNING *`,
      [
        params.id,
        framework,
        JSON.stringify(codeData.files),
        JSON.stringify(codeData.dependencies),
      ]
    );

    // Update project status
    await query(
      `UPDATE website_projects SET
        status = 'review',
        generated_code_data = $1
       WHERE id = $2`,
      [JSON.stringify(codeData), params.id]
    );

    return successResponse(
      {
        generatedCode: generatedCode[0],
        files: codeData.files,
        dependencies: codeData.dependencies,
      },
      'Website code generated successfully'
    );
  } catch (error: any) {
    console.error('Generate code error:', error);
    return errorResponse(error.message || 'Failed to generate code', 500);
  }
}
