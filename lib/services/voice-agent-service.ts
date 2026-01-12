/**
 * AI Voice Agent Service
 * Handles AI-powered phone calls for lead qualification, appointment scheduling, and support
 * Integrates with Twilio Voice, ElevenLabs, and Google/OpenAI for natural conversations
 */

// Types
export interface VoiceAgent {
  id: string;
  name: string;
  voiceId: string;
  voiceProvider: 'elevenlabs' | 'google' | 'azure' | 'openai';
  language: string;
  personality: string;
  systemPrompt: string;
  greetingMessage: string;
  fallbackMessage: string;
  maxCallDuration: number; // seconds
  transferNumber?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CallSession {
  id: string;
  agentId: string;
  callSid: string;
  direction: 'inbound' | 'outbound';
  fromNumber: string;
  toNumber: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy';
  startTime: string;
  endTime?: string;
  duration?: number;
  transcript: ConversationTurn[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: CallOutcome;
  recording?: {
    url: string;
    duration: number;
  };
  metadata?: Record<string, any>;
}

export interface ConversationTurn {
  role: 'agent' | 'caller';
  content: string;
  timestamp: string;
  sentiment?: string;
  intent?: string;
}

export interface CallOutcome {
  type: 'qualified_lead' | 'appointment_scheduled' | 'callback_requested' | 'not_interested' | 'wrong_number' | 'voicemail' | 'transferred' | 'other';
  notes?: string;
  appointmentTime?: string;
  callbackTime?: string;
  leadScore?: number;
  nextAction?: string;
}

export interface VoiceConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  elevenLabsApiKey?: string;
  googleCloudApiKey?: string;
  openaiApiKey?: string;
  webhookBaseUrl: string;
}

export interface CallScript {
  id: string;
  name: string;
  type: 'lead_qualification' | 'appointment_setting' | 'follow_up' | 'survey' | 'support' | 'custom';
  steps: ScriptStep[];
  variables: Record<string, string>;
}

export interface ScriptStep {
  id: string;
  message: string;
  waitForResponse: boolean;
  responseHandlers: ResponseHandler[];
  fallback?: string;
  timeout?: number;
}

export interface ResponseHandler {
  intent: string;
  keywords?: string[];
  action: 'continue' | 'goto' | 'transfer' | 'end' | 'schedule';
  nextStepId?: string;
  transferNumber?: string;
  data?: Record<string, any>;
}

// Voice Synthesis Service
class VoiceSynthesizer {
  private provider: string;
  private apiKey: string;

  constructor(provider: string, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async synthesize(text: string, voiceId: string): Promise<ArrayBuffer> {
    switch (this.provider) {
      case 'elevenlabs':
        return this.synthesizeElevenLabs(text, voiceId);
      case 'google':
        return this.synthesizeGoogle(text, voiceId);
      case 'openai':
        return this.synthesizeOpenAI(text, voiceId);
      default:
        throw new Error(`Unknown voice provider: ${this.provider}`);
    }
  }

  private async synthesizeElevenLabs(text: string, voiceId: string): Promise<ArrayBuffer> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('ElevenLabs synthesis failed');
    }

    return response.arrayBuffer();
  }

  private async synthesizeGoogle(text: string, voiceId: string): Promise<ArrayBuffer> {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', name: voiceId },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Google TTS synthesis failed');
    }

    const data = await response.json();
    return Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0)).buffer;
  }

  private async synthesizeOpenAI(text: string, voiceId: string): Promise<ArrayBuffer> {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: voiceId || 'alloy',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI TTS synthesis failed');
    }

    return response.arrayBuffer();
  }
}

// Speech Recognition Service
class SpeechRecognizer {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async transcribe(audioBuffer: ArrayBuffer): Promise<string> {
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Speech recognition failed');
    }

    const data = await response.json();
    return data.text;
  }
}

// Conversation AI Service
class ConversationAI {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(
    systemPrompt: string,
    conversationHistory: ConversationTurn[],
    userMessage: string
  ): Promise<{ response: string; intent?: string; sentiment?: string }> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(turn => ({
        role: turn.role === 'agent' ? 'assistant' : 'user',
        content: turn.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 300,
        functions: [
          {
            name: 'analyze_response',
            parameters: {
              type: 'object',
              properties: {
                response: { type: 'string', description: 'The agent response to speak' },
                intent: { type: 'string', description: 'Detected user intent' },
                sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                shouldTransfer: { type: 'boolean' },
                shouldEndCall: { type: 'boolean' },
                appointmentRequested: { type: 'boolean' },
              },
              required: ['response'],
            },
          },
        ],
        function_call: { name: 'analyze_response' },
      }),
    });

    if (!response.ok) {
      throw new Error('Conversation AI failed');
    }

    const data = await response.json();
    const functionCall = data.choices[0]?.message?.function_call;

    if (functionCall) {
      const args = JSON.parse(functionCall.arguments);
      return {
        response: args.response,
        intent: args.intent,
        sentiment: args.sentiment,
      };
    }

    return { response: data.choices[0]?.message?.content || '' };
  }
}

// Main Voice Agent Service
export class VoiceAgentService {
  private config: VoiceConfig;
  private synthesizer: VoiceSynthesizer;
  private recognizer: SpeechRecognizer;
  private conversationAI: ConversationAI;
  private activeCalls: Map<string, CallSession> = new Map();

  constructor(config: VoiceConfig) {
    this.config = config;
    this.synthesizer = new VoiceSynthesizer(
      'elevenlabs',
      config.elevenLabsApiKey || ''
    );
    this.recognizer = new SpeechRecognizer(config.openaiApiKey || '');
    this.conversationAI = new ConversationAI(config.openaiApiKey || '');
  }

  // Create a new voice agent
  async createAgent(agent: Omit<VoiceAgent, 'id' | 'createdAt'>): Promise<VoiceAgent> {
    return {
      ...agent,
      id: `agent_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }

  // Initiate outbound call
  async initiateCall(
    agent: VoiceAgent,
    toNumber: string,
    metadata?: Record<string, any>
  ): Promise<CallSession> {
    // In production, this would use Twilio to initiate the call
    const session: CallSession = {
      id: `call_${Date.now()}`,
      agentId: agent.id,
      callSid: `CA${Date.now()}`,
      direction: 'outbound',
      fromNumber: this.config.twilioPhoneNumber,
      toNumber,
      status: 'queued',
      startTime: new Date().toISOString(),
      transcript: [],
      metadata,
    };

    this.activeCalls.set(session.id, session);

    // Simulate Twilio call initiation
    console.log(`[VoiceAgent] Initiating call to ${toNumber}`);

    return session;
  }

  // Handle incoming call
  async handleIncomingCall(
    agent: VoiceAgent,
    callSid: string,
    fromNumber: string
  ): Promise<CallSession> {
    const session: CallSession = {
      id: `call_${Date.now()}`,
      agentId: agent.id,
      callSid,
      direction: 'inbound',
      fromNumber,
      toNumber: this.config.twilioPhoneNumber,
      status: 'ringing',
      startTime: new Date().toISOString(),
      transcript: [],
    };

    this.activeCalls.set(session.id, session);

    // Add greeting to transcript
    session.transcript.push({
      role: 'agent',
      content: agent.greetingMessage,
      timestamp: new Date().toISOString(),
    });

    return session;
  }

  // Process caller speech
  async processCallerSpeech(
    sessionId: string,
    agent: VoiceAgent,
    audioBuffer: ArrayBuffer
  ): Promise<string> {
    const session = this.activeCalls.get(sessionId);
    if (!session) {
      throw new Error('Call session not found');
    }

    // Transcribe caller speech
    const callerText = await this.recognizer.transcribe(audioBuffer);

    // Add to transcript
    session.transcript.push({
      role: 'caller',
      content: callerText,
      timestamp: new Date().toISOString(),
    });

    // Generate AI response
    const { response, intent, sentiment } = await this.conversationAI.generateResponse(
      agent.systemPrompt,
      session.transcript,
      callerText
    );

    // Add agent response to transcript
    session.transcript.push({
      role: 'agent',
      content: response,
      timestamp: new Date().toISOString(),
      intent,
      sentiment,
    });

    // Update session sentiment
    if (sentiment) {
      session.sentiment = sentiment as 'positive' | 'neutral' | 'negative';
    }

    return response;
  }

  // Synthesize agent speech
  async synthesizeAgentSpeech(
    agent: VoiceAgent,
    text: string
  ): Promise<ArrayBuffer> {
    return this.synthesizer.synthesize(text, agent.voiceId);
  }

  // Transfer call
  async transferCall(sessionId: string, toNumber: string): Promise<void> {
    const session = this.activeCalls.get(sessionId);
    if (!session) {
      throw new Error('Call session not found');
    }

    console.log(`[VoiceAgent] Transferring call ${sessionId} to ${toNumber}`);

    session.outcome = {
      type: 'transferred',
      notes: `Transferred to ${toNumber}`,
    };

    // In production, this would use Twilio to transfer
  }

  // End call
  async endCall(sessionId: string, outcome?: CallOutcome): Promise<CallSession> {
    const session = this.activeCalls.get(sessionId);
    if (!session) {
      throw new Error('Call session not found');
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();
    session.duration = Math.floor(
      (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000
    );

    if (outcome) {
      session.outcome = outcome;
    }

    // Remove from active calls
    this.activeCalls.delete(sessionId);

    return session;
  }

  // Get call session
  getSession(sessionId: string): CallSession | undefined {
    return this.activeCalls.get(sessionId);
  }

  // Get all active calls
  getActiveCalls(): CallSession[] {
    return Array.from(this.activeCalls.values());
  }

  // Analyze call for lead qualification
  async analyzeCallForQualification(session: CallSession): Promise<{
    qualified: boolean;
    score: number;
    signals: string[];
    recommendedAction: string;
  }> {
    const transcript = session.transcript.map(t => `${t.role}: ${t.content}`).join('\n');

    // In production, this would use AI to analyze
    // For demo, return mock analysis
    return {
      qualified: session.sentiment !== 'negative',
      score: session.sentiment === 'positive' ? 85 : session.sentiment === 'neutral' ? 50 : 20,
      signals: [
        'Expressed interest in product',
        'Asked about pricing',
        'Mentioned budget approval timeline',
      ],
      recommendedAction: session.sentiment === 'positive' ? 'Schedule demo' : 'Add to nurture sequence',
    };
  }

  // Generate TwiML for Twilio
  generateTwiML(action: 'answer' | 'say' | 'gather' | 'hangup', options?: any): string {
    switch (action) {
      case 'answer':
        return `
          <Response>
            <Say voice="Polly.Amy">${options?.message || 'Hello'}</Say>
            <Gather input="speech" timeout="5" action="${this.config.webhookBaseUrl}/voice/process">
              <Say voice="Polly.Amy">How can I help you today?</Say>
            </Gather>
          </Response>
        `;

      case 'say':
        return `
          <Response>
            <Say voice="Polly.Amy">${options?.message}</Say>
            ${options?.gather ? `
              <Gather input="speech" timeout="5" action="${this.config.webhookBaseUrl}/voice/process" />
            ` : ''}
          </Response>
        `;

      case 'hangup':
        return `
          <Response>
            <Say voice="Polly.Amy">${options?.message || 'Goodbye'}</Say>
            <Hangup />
          </Response>
        `;

      default:
        return '<Response />';
    }
  }
}

// Pre-built scripts
export const CALL_SCRIPTS: Record<string, CallScript> = {
  lead_qualification: {
    id: 'script_lead_qual',
    name: 'Lead Qualification',
    type: 'lead_qualification',
    variables: {
      companyName: 'OrenGen',
      productName: 'CRM Platform',
    },
    steps: [
      {
        id: 'greeting',
        message: "Hi, this is {agentName} from {companyName}. I'm reaching out because you recently showed interest in our {productName}. Do you have a moment to chat?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'yes', keywords: ['yes', 'sure', 'okay'], action: 'goto', nextStepId: 'discovery' },
          { intent: 'no', keywords: ['no', 'busy', 'not now'], action: 'goto', nextStepId: 'reschedule' },
          { intent: 'wrong_number', keywords: ['wrong number', 'who'], action: 'end' },
        ],
        fallback: "I understand. Would there be a better time to call back?",
        timeout: 10,
      },
      {
        id: 'discovery',
        message: "Great! Can you tell me a bit about what challenges you're currently facing with your customer management?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'has_challenges', action: 'goto', nextStepId: 'solution' },
          { intent: 'no_challenges', action: 'goto', nextStepId: 'benefits' },
        ],
        fallback: "I see. Let me tell you how we've helped similar businesses.",
        timeout: 15,
      },
      {
        id: 'solution',
        message: "That's exactly what our platform helps with. Would you be interested in seeing a quick demo?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'yes', action: 'schedule' },
          { intent: 'no', action: 'goto', nextStepId: 'objection' },
        ],
        timeout: 10,
      },
      {
        id: 'reschedule',
        message: "No problem at all. When would be a better time for me to call back?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'time_given', action: 'schedule' },
          { intent: 'never', action: 'end' },
        ],
        timeout: 10,
      },
    ],
  },

  appointment_setting: {
    id: 'script_appt',
    name: 'Appointment Setting',
    type: 'appointment_setting',
    variables: {},
    steps: [
      {
        id: 'intro',
        message: "Hi, I'm calling to schedule your demo with our team. Do you have your calendar handy?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'yes', action: 'goto', nextStepId: 'suggest_time' },
          { intent: 'no', action: 'goto', nextStepId: 'callback' },
        ],
        timeout: 10,
      },
      {
        id: 'suggest_time',
        message: "Perfect. We have availability this Thursday at 2 PM or Friday at 10 AM. Which works better for you?",
        waitForResponse: true,
        responseHandlers: [
          { intent: 'time_selected', action: 'schedule' },
          { intent: 'neither', action: 'goto', nextStepId: 'other_times' },
        ],
        timeout: 15,
      },
    ],
  },
};

// Factory function
export function createVoiceAgentService(config: VoiceConfig): VoiceAgentService {
  return new VoiceAgentService(config);
}

// Default agent personalities
export const AGENT_PERSONALITIES = {
  professional: "You are a professional, courteous business representative. Speak clearly and concisely. Be helpful but not pushy. Always maintain a positive tone.",
  friendly: "You are a warm, friendly assistant. Use casual language while remaining professional. Show genuine interest in helping the caller.",
  consultative: "You are an expert consultant. Ask thoughtful questions to understand needs. Provide valuable insights. Guide conversations toward solutions.",
  energetic: "You are an enthusiastic, energetic representative. Show excitement about helping. Be upbeat and positive. Create urgency without being aggressive.",
};
