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

// POST /api/websites/projects/[id]/generate-wireframe - Generate wireframe using AI
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

    // Get the project
    const projects = await query(
      'SELECT * FROM website_projects WHERE id = $1',
      [params.id]
    );

    if (projects.length === 0) {
      return notFoundResponse('Project not found');
    }

    const project = projects[0];

    if (!project.responses || project.responses.length === 0) {
      return errorResponse('No questionnaire responses found. Please complete the questionnaire first.');
    }

    // Initialize Anthropic client
    if (!process.env.CLAUDE_API_KEY) {
      return errorResponse('Claude API key not configured', 500);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Build prompt from responses
    const responsesText = project.responses
      .map((r: any) => `Q: ${r.question}\nA: ${Array.isArray(r.answer) ? r.answer.join(', ') : r.answer}`)
      .join('\n\n');

    const prompt = `Based on the following website questionnaire responses, create a comprehensive wireframe structure for the website.

${responsesText}

Please provide a detailed wireframe structure in JSON format with the following schema:
{
  "pages": [
    {
      "name": "Page name",
      "path": "/path",
      "sections": [
        {
          "type": "hero|features|about|services|testimonials|cta|contact|footer|gallery|pricing|faq",
          "layout": "single-column|two-column|three-column|grid|masonry",
          "content": "Description of what should be in this section",
          "position": 1
        }
      ]
    }
  ],
  "navigation": {
    "type": "top|side|hamburger|mega-menu",
    "items": [
      {
        "label": "Label",
        "path": "/path",
        "children": []
      }
    ],
    "sticky": true,
    "transparent": false
  }
}

Make the wireframe comprehensive, modern, and tailored to their business needs.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
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
      return errorResponse('Failed to generate valid wireframe structure', 500);
    }

    const wireframeData = JSON.parse(jsonMatch[0]);

    // Save wireframe to database
    const wireframe = await query(
      `INSERT INTO wireframes (project_id, pages, navigation, generated_by, prompt)
       VALUES ($1, $2, $3, 'claude', $4)
       RETURNING *`,
      [
        params.id,
        JSON.stringify(wireframeData.pages),
        JSON.stringify(wireframeData.navigation),
        prompt,
      ]
    );

    // Update project status
    await query(
      `UPDATE website_projects SET
        status = 'design',
        wireframe_data = $1
       WHERE id = $2`,
      [JSON.stringify(wireframeData), params.id]
    );

    return successResponse(
      {
        wireframe: wireframe[0],
        wireframeData,
      },
      'Wireframe generated successfully'
    );
  } catch (error: any) {
    console.error('Generate wireframe error:', error);
    return errorResponse(error.message || 'Failed to generate wireframe', 500);
  }
}
