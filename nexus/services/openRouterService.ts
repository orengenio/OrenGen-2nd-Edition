import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Available models on OpenRouter
 */
export const AVAILABLE_MODELS = {
  // Anthropic Models
  CLAUDE_OPUS: 'anthropic/claude-3.5-sonnet',
  CLAUDE_SONNET: 'anthropic/claude-3-sonnet',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku',
  
  // OpenAI Models
  GPT4_TURBO: 'openai/gpt-4-turbo',
  GPT4: 'openai/gpt-4',
  GPT35_TURBO: 'openai/gpt-3.5-turbo',
  
  // Google Models
  GEMINI_PRO: 'google/gemini-pro',
  GEMINI_PRO_VISION: 'google/gemini-pro-vision',
  
  // Meta Models
  LLAMA3_70B: 'meta-llama/llama-3-70b-instruct',
  LLAMA3_8B: 'meta-llama/llama-3-8b-instruct',
  
  // Mistral Models
  MIXTRAL_8X7B: 'mistralai/mixtral-8x7b-instruct',
  MISTRAL_7B: 'mistralai/mistral-7b-instruct',
} as const;

/**
 * Send a message to OpenRouter and get a response
 */
export async function sendToOpenRouter(
  messages: OpenRouterMessage[],
  model: string = AVAILABLE_MODELS.CLAUDE_SONNET,
  options?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  }
): Promise<OpenRouterResponse> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model,
        messages,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 0.7,
        top_p: options?.topP || 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://orengen.io',
          'X-Title': 'OrenGen Nexus',
          'Content-Type': 'application/json',
        },
      }
    );

    const choice = response.data.choices[0];
    
    return {
      content: choice.message.content,
      model: response.data.model,
      usage: response.data.usage,
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw new Error('Failed to get response from OpenRouter');
  }
}

/**
 * Compare responses from multiple models
 */
export async function compareModels(
  prompt: string,
  models: string[] = [
    AVAILABLE_MODELS.CLAUDE_SONNET,
    AVAILABLE_MODELS.GPT4,
    AVAILABLE_MODELS.GEMINI_PRO,
  ]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const messages: OpenRouterMessage[] = [
    { role: 'user', content: prompt }
  ];

  await Promise.all(
    models.map(async (model) => {
      try {
        const response = await sendToOpenRouter(messages, model);
        results.set(model, response.content);
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        results.set(model, `Error: ${error}`);
      }
    })
  );

  return results;
}

/**
 * Get best model for a specific task
 */
export function getModelForTask(task: 'coding' | 'analysis' | 'creative' | 'fast'): string {
  switch (task) {
    case 'coding':
      return AVAILABLE_MODELS.CLAUDE_SONNET;
    case 'analysis':
      return AVAILABLE_MODELS.GPT4;
    case 'creative':
      return AVAILABLE_MODELS.CLAUDE_OPUS;
    case 'fast':
      return AVAILABLE_MODELS.GPT35_TURBO;
    default:
      return AVAILABLE_MODELS.CLAUDE_SONNET;
  }
}
