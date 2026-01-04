import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Send a message to Claude and get a response
 */
export async function sendToClaude(
  messages: ClaudeMessage[],
  model: string = 'claude-sonnet-4-20250514',
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<ClaudeResponse> {
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 0.7,
      system: options?.systemPrompt || 'You are a helpful AI assistant for OrenGen business operations.',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    const textContent = content.type === 'text' ? content.text : '';

    return {
      content: textContent,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to get response from Claude');
  }
}

/**
 * Stream a response from Claude
 */
export async function* streamClaude(
  messages: ClaudeMessage[],
  model: string = 'claude-sonnet-4-20250514',
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): AsyncGenerator<string> {
  try {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 0.7,
      system: options?.systemPrompt || 'You are a helpful AI assistant for OrenGen business operations.',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error('Claude Streaming Error:', error);
    throw new Error('Failed to stream from Claude');
  }
}

/**
 * Generate code using Claude
 */
export async function generateCode(
  prompt: string,
  language: string = 'typescript'
): Promise<string> {
  const systemPrompt = `You are an expert ${language} developer. Generate clean, production-ready code based on the user's requirements. Include proper types, error handling, and comments.`;

  const response = await sendToClaude(
    [{ role: 'user', content: prompt }],
    'claude-sonnet-4-20250514',
    { systemPrompt, temperature: 0.3 }
  );

  return response.content;
}

/**
 * Analyze and improve existing code
 */
export async function improveCode(
  code: string,
  instructions?: string
): Promise<string> {
  const prompt = instructions
    ? `Improve this code based on these instructions: ${instructions}\n\nCode:\n${code}`
    : `Analyze and improve this code. Fix bugs, improve performance, add types if missing, and enhance readability:\n\n${code}`;

  const response = await sendToClaude(
    [{ role: 'user', content: prompt }],
    'claude-sonnet-4-20250514',
    { 
      systemPrompt: 'You are an expert code reviewer and refactoring specialist.',
      temperature: 0.2 
    }
  );

  return response.content;
}
