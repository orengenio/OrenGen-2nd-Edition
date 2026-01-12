// AI SDR (Sales Development Representative) Service
// Autonomous AI sales agents that handle full conversations, objection handling, and meeting booking

export interface SDRPersona {
  id: string;
  name: string;
  avatar: string;
  role: 'sdr' | 'ae' | 'csm' | 'support';
  tone: 'professional' | 'friendly' | 'casual' | 'formal';
  industry_expertise: string[];
  languages: string[];
  working_hours: { start: string; end: string; timezone: string };
  response_time: 'instant' | 'human_like' | 'delayed';
  personality_traits: string[];
  objection_handling_style: 'empathetic' | 'direct' | 'consultative';
  created_at: Date;
  performance: SDRPerformance;
}

export interface SDRPerformance {
  conversations_handled: number;
  meetings_booked: number;
  deals_influenced: number;
  avg_response_time: number;
  satisfaction_score: number;
  conversion_rate: number;
  objections_overcome: number;
}

export interface Conversation {
  id: string;
  sdr_id: string;
  lead_id: string;
  lead_name: string;
  lead_email: string;
  lead_company: string;
  channel: 'email' | 'linkedin' | 'sms' | 'chat' | 'whatsapp';
  status: 'active' | 'waiting' | 'meeting_scheduled' | 'closed_won' | 'closed_lost' | 'handed_off';
  sentiment: 'positive' | 'neutral' | 'negative' | 'interested' | 'objecting';
  messages: ConversationMessage[];
  objections_raised: Objection[];
  meeting_scheduled?: ScheduledMeeting;
  next_action: string;
  ai_confidence: number;
  handoff_requested: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationMessage {
  id: string;
  sender: 'sdr' | 'lead';
  content: string;
  timestamp: Date;
  channel: string;
  sentiment?: string;
  intent?: string;
  ai_generated: boolean;
  approved?: boolean;
}

export interface Objection {
  id: string;
  type: 'price' | 'timing' | 'competition' | 'authority' | 'need' | 'trust' | 'custom';
  content: string;
  response: string;
  outcome: 'overcome' | 'pending' | 'escalated';
  timestamp: Date;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  datetime: Date;
  duration: number;
  meeting_link: string;
  attendees: string[];
  notes: string;
  calendar_synced: boolean;
}

export interface OutreachSequence {
  id: string;
  name: string;
  sdr_id: string;
  channel: 'email' | 'linkedin' | 'multi_channel';
  steps: SequenceStep[];
  active_leads: number;
  completed: number;
  reply_rate: number;
  meeting_rate: number;
  status: 'active' | 'paused' | 'completed';
}

export interface SequenceStep {
  id: string;
  order: number;
  type: 'email' | 'linkedin_connect' | 'linkedin_message' | 'sms' | 'call' | 'wait';
  delay_days: number;
  template: string;
  personalization_fields: string[];
  a_b_variants?: { a: string; b: string };
  sent: number;
  opened: number;
  replied: number;
}

export interface ObjectionPlaybook {
  id: string;
  objection_type: string;
  triggers: string[];
  responses: PlaybookResponse[];
  escalation_threshold: number;
}

export interface PlaybookResponse {
  id: string;
  response: string;
  tone: string;
  effectiveness_score: number;
  use_count: number;
}

export interface LeadIntelligence {
  lead_id: string;
  company_size: string;
  industry: string;
  tech_stack: string[];
  recent_news: string[];
  hiring_signals: string[];
  funding_info?: { amount: string; round: string; date: Date };
  social_activity: string[];
  best_contact_time: string;
  recommended_approach: string;
  pain_points: string[];
  buying_signals: string[];
}

class AISDRService {
  private personas: Map<string, SDRPersona> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private sequences: Map<string, OutreachSequence> = new Map();
  private playbooks: Map<string, ObjectionPlaybook> = new Map();

  // Create AI SDR Persona
  async createSDR(config: {
    name: string;
    role: SDRPersona['role'];
    tone: SDRPersona['tone'];
    industry_expertise: string[];
    personality_traits: string[];
  }): Promise<SDRPersona> {
    const sdr: SDRPersona = {
      id: `sdr_${Date.now()}`,
      name: config.name,
      avatar: this.generateAvatar(config.name),
      role: config.role,
      tone: config.tone,
      industry_expertise: config.industry_expertise,
      languages: ['English'],
      working_hours: { start: '09:00', end: '18:00', timezone: 'America/New_York' },
      response_time: 'human_like',
      personality_traits: config.personality_traits,
      objection_handling_style: 'consultative',
      created_at: new Date(),
      performance: {
        conversations_handled: 0,
        meetings_booked: 0,
        deals_influenced: 0,
        avg_response_time: 0,
        satisfaction_score: 0,
        conversion_rate: 0,
        objections_overcome: 0
      }
    };

    this.personas.set(sdr.id, sdr);
    return sdr;
  }

  // Generate personalized outreach
  async generateOutreach(
    sdr_id: string,
    lead: {
      name: string;
      email: string;
      company: string;
      title: string;
      linkedin?: string;
    },
    context: {
      product: string;
      value_prop: string;
      case_studies?: string[];
    }
  ): Promise<{ subject: string; body: string; personalization_score: number }> {
    const sdr = this.personas.get(sdr_id);
    if (!sdr) throw new Error('SDR not found');

    // Get lead intelligence
    const intelligence = await this.getLeadIntelligence(lead.company);

    // Generate highly personalized message
    const personalization_elements = [
      intelligence.recent_news.length > 0 ? `recent company news` : null,
      intelligence.hiring_signals.length > 0 ? `hiring activity` : null,
      intelligence.funding_info ? `funding round` : null,
      intelligence.tech_stack.length > 0 ? `tech stack alignment` : null,
    ].filter(Boolean);

    const templates = this.getOutreachTemplates(sdr.tone, context.product);

    // AI would generate this - simulating personalized output
    const subject = this.personalizeSubject(templates.subjects[0], lead, intelligence);
    const body = this.personalizeBody(templates.body, lead, intelligence, context, sdr);

    return {
      subject,
      body,
      personalization_score: Math.min(100, 60 + personalization_elements.length * 10)
    };
  }

  // Handle incoming message with AI
  async handleIncomingMessage(
    conversation_id: string,
    message: string,
    channel: string
  ): Promise<{
    response: string;
    intent: string;
    sentiment: string;
    suggested_action: string;
    confidence: number;
    requires_human: boolean;
  }> {
    const conversation = this.conversations.get(conversation_id);
    if (!conversation) throw new Error('Conversation not found');

    const sdr = this.personas.get(conversation.sdr_id);
    if (!sdr) throw new Error('SDR not found');

    // Analyze message
    const analysis = this.analyzeMessage(message);

    // Check for objections
    const objection = this.detectObjection(message);
    if (objection) {
      const response = await this.handleObjection(conversation_id, objection, sdr);
      return {
        response: response.response,
        intent: 'objection',
        sentiment: analysis.sentiment,
        suggested_action: response.next_action,
        confidence: response.confidence,
        requires_human: response.confidence < 0.6
      };
    }

    // Check for meeting request
    if (analysis.intent === 'meeting_interest') {
      const meetingResponse = await this.proposeMeeting(conversation_id, sdr);
      return {
        response: meetingResponse.message,
        intent: 'meeting_booking',
        sentiment: 'positive',
        suggested_action: 'await_confirmation',
        confidence: 0.95,
        requires_human: false
      };
    }

    // Generate contextual response
    const response = await this.generateResponse(conversation, message, analysis, sdr);

    // Add message to conversation
    conversation.messages.push({
      id: `msg_${Date.now()}`,
      sender: 'lead',
      content: message,
      timestamp: new Date(),
      channel,
      sentiment: analysis.sentiment,
      intent: analysis.intent,
      ai_generated: false
    });

    conversation.messages.push({
      id: `msg_${Date.now() + 1}`,
      sender: 'sdr',
      content: response.text,
      timestamp: new Date(),
      channel,
      ai_generated: true,
      approved: response.confidence > 0.8
    });

    conversation.sentiment = analysis.sentiment as Conversation['sentiment'];
    conversation.ai_confidence = response.confidence;
    conversation.updated_at = new Date();

    return {
      response: response.text,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      suggested_action: response.next_action,
      confidence: response.confidence,
      requires_human: response.confidence < 0.7 || analysis.sentiment === 'negative'
    };
  }

  // Handle objections with playbook
  async handleObjection(
    conversation_id: string,
    objection: { type: Objection['type']; content: string },
    sdr: SDRPersona
  ): Promise<{
    response: string;
    next_action: string;
    confidence: number;
  }> {
    const playbook = this.getObjectionPlaybook(objection.type);

    // Select best response based on SDR style and context
    const bestResponse = playbook.responses.sort(
      (a, b) => b.effectiveness_score - a.effectiveness_score
    )[0];

    // Personalize response based on SDR tone
    let response = bestResponse.response;
    if (sdr.tone === 'friendly') {
      response = this.makeFriendly(response);
    } else if (sdr.tone === 'formal') {
      response = this.makeFormal(response);
    }

    const conversation = this.conversations.get(conversation_id);
    if (conversation) {
      conversation.objections_raised.push({
        id: `obj_${Date.now()}`,
        type: objection.type,
        content: objection.content,
        response,
        outcome: 'pending',
        timestamp: new Date()
      });
    }

    return {
      response,
      next_action: 'await_response',
      confidence: bestResponse.effectiveness_score / 100
    };
  }

  // Book meeting automatically
  async bookMeeting(
    conversation_id: string,
    proposed_times: Date[],
    meeting_type: string
  ): Promise<ScheduledMeeting> {
    const conversation = this.conversations.get(conversation_id);
    if (!conversation) throw new Error('Conversation not found');

    const meeting: ScheduledMeeting = {
      id: `mtg_${Date.now()}`,
      title: `Discovery Call - ${conversation.lead_company}`,
      datetime: proposed_times[0],
      duration: 30,
      meeting_link: `https://meet.orengen.io/${conversation_id}`,
      attendees: [conversation.lead_email],
      notes: `Booked by AI SDR. Lead sentiment: ${conversation.sentiment}`,
      calendar_synced: true
    };

    conversation.meeting_scheduled = meeting;
    conversation.status = 'meeting_scheduled';

    // Update SDR performance
    const sdr = this.personas.get(conversation.sdr_id);
    if (sdr) {
      sdr.performance.meetings_booked++;
      sdr.performance.conversion_rate =
        sdr.performance.meetings_booked / sdr.performance.conversations_handled;
    }

    return meeting;
  }

  // Create outreach sequence
  async createSequence(config: {
    name: string;
    sdr_id: string;
    channel: OutreachSequence['channel'];
    steps: Omit<SequenceStep, 'id' | 'sent' | 'opened' | 'replied'>[];
  }): Promise<OutreachSequence> {
    const sequence: OutreachSequence = {
      id: `seq_${Date.now()}`,
      name: config.name,
      sdr_id: config.sdr_id,
      channel: config.channel,
      steps: config.steps.map((step, index) => ({
        ...step,
        id: `step_${Date.now()}_${index}`,
        sent: 0,
        opened: 0,
        replied: 0
      })),
      active_leads: 0,
      completed: 0,
      reply_rate: 0,
      meeting_rate: 0,
      status: 'active'
    };

    this.sequences.set(sequence.id, sequence);
    return sequence;
  }

  // Add leads to sequence
  async addLeadsToSequence(
    sequence_id: string,
    leads: { email: string; name: string; company: string }[]
  ): Promise<{ added: number; skipped: number }> {
    const sequence = this.sequences.get(sequence_id);
    if (!sequence) throw new Error('Sequence not found');

    let added = 0;
    let skipped = 0;

    for (const lead of leads) {
      // Check if lead is already in a sequence
      const existingConversation = Array.from(this.conversations.values())
        .find(c => c.lead_email === lead.email && c.status === 'active');

      if (existingConversation) {
        skipped++;
        continue;
      }

      // Create conversation for lead
      const conversation: Conversation = {
        id: `conv_${Date.now()}_${added}`,
        sdr_id: sequence.sdr_id,
        lead_id: `lead_${Date.now()}_${added}`,
        lead_name: lead.name,
        lead_email: lead.email,
        lead_company: lead.company,
        channel: sequence.channel === 'multi_channel' ? 'email' : sequence.channel as Conversation['channel'],
        status: 'active',
        sentiment: 'neutral',
        messages: [],
        objections_raised: [],
        next_action: 'send_first_touch',
        ai_confidence: 1,
        handoff_requested: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      this.conversations.set(conversation.id, conversation);
      added++;
    }

    sequence.active_leads += added;
    return { added, skipped };
  }

  // Hand off to human
  async requestHandoff(
    conversation_id: string,
    reason: string
  ): Promise<{ success: boolean; notification_sent: boolean }> {
    const conversation = this.conversations.get(conversation_id);
    if (!conversation) throw new Error('Conversation not found');

    conversation.handoff_requested = true;
    conversation.status = 'handed_off';
    conversation.next_action = `Human review needed: ${reason}`;

    // In production, this would send notification
    return { success: true, notification_sent: true };
  }

  // Get SDR dashboard metrics
  async getSDRDashboard(sdr_id: string): Promise<{
    performance: SDRPerformance;
    active_conversations: number;
    pending_responses: number;
    meetings_this_week: number;
    top_objections: { type: string; count: number }[];
    conversion_funnel: { stage: string; count: number }[];
  }> {
    const sdr = this.personas.get(sdr_id);
    if (!sdr) throw new Error('SDR not found');

    const sdrConversations = Array.from(this.conversations.values())
      .filter(c => c.sdr_id === sdr_id);

    const activeConversations = sdrConversations.filter(c => c.status === 'active');
    const pendingResponses = activeConversations.filter(c => {
      const lastMessage = c.messages[c.messages.length - 1];
      return lastMessage && lastMessage.sender === 'lead';
    });

    // Count objections
    const objectionCounts = new Map<string, number>();
    sdrConversations.forEach(c => {
      c.objections_raised.forEach(obj => {
        objectionCounts.set(obj.type, (objectionCounts.get(obj.type) || 0) + 1);
      });
    });

    return {
      performance: sdr.performance,
      active_conversations: activeConversations.length,
      pending_responses: pendingResponses.length,
      meetings_this_week: sdrConversations.filter(c => c.meeting_scheduled).length,
      top_objections: Array.from(objectionCounts.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      conversion_funnel: [
        { stage: 'Contacted', count: sdrConversations.length },
        { stage: 'Engaged', count: sdrConversations.filter(c => c.messages.length > 2).length },
        { stage: 'Qualified', count: sdrConversations.filter(c => c.sentiment === 'interested').length },
        { stage: 'Meeting Booked', count: sdrConversations.filter(c => c.meeting_scheduled).length },
        { stage: 'Closed Won', count: sdrConversations.filter(c => c.status === 'closed_won').length }
      ]
    };
  }

  // Private helper methods
  private generateAvatar(name: string): string {
    return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}`;
  }

  private async getLeadIntelligence(company: string): Promise<LeadIntelligence> {
    // In production, this would call enrichment APIs
    return {
      lead_id: `lead_${Date.now()}`,
      company_size: '50-200',
      industry: 'Technology',
      tech_stack: ['React', 'Node.js', 'AWS'],
      recent_news: ['Raised Series A funding', 'Expanded to new market'],
      hiring_signals: ['Hiring SDRs', 'Hiring Engineers'],
      funding_info: { amount: '$5M', round: 'Series A', date: new Date() },
      social_activity: ['Posted about growth challenges'],
      best_contact_time: 'Tuesday 10am',
      recommended_approach: 'consultative',
      pain_points: ['Scaling sales team', 'Lead quality'],
      buying_signals: ['Evaluating solutions', 'Budget approved']
    };
  }

  private getOutreachTemplates(tone: string, product: string) {
    return {
      subjects: [
        `Quick question about ${product}`,
        `Saw your recent {news} - thoughts on {value_prop}?`,
        `{first_name}, {mutual_connection} suggested I reach out`
      ],
      body: `Hi {first_name},

I noticed {personalization_hook} and thought you might be interested in how {product} helps companies like {company} {value_prop}.

{social_proof}

Would you be open to a quick 15-minute call to explore if this could help {company}?

Best,
{sdr_name}`
    };
  }

  private personalizeSubject(template: string, lead: any, intelligence: LeadIntelligence): string {
    return template
      .replace('{first_name}', lead.name.split(' ')[0])
      .replace('{news}', intelligence.recent_news[0] || 'growth')
      .replace('{value_prop}', 'accelerating growth');
  }

  private personalizeBody(template: string, lead: any, intelligence: LeadIntelligence, context: any, sdr: SDRPersona): string {
    const hooks = [];
    if (intelligence.recent_news.length > 0) hooks.push(`you recently ${intelligence.recent_news[0].toLowerCase()}`);
    if (intelligence.hiring_signals.length > 0) hooks.push(`${lead.company} is ${intelligence.hiring_signals[0].toLowerCase()}`);

    return template
      .replace('{first_name}', lead.name.split(' ')[0])
      .replace('{personalization_hook}', hooks[0] || `${lead.company} is growing`)
      .replace('{product}', context.product)
      .replace('{company}', lead.company)
      .replace('{value_prop}', context.value_prop)
      .replace('{social_proof}', context.case_studies?.[0] || '')
      .replace('{sdr_name}', sdr.name);
  }

  private analyzeMessage(message: string): { sentiment: string; intent: string } {
    const lowerMessage = message.toLowerCase();

    // Sentiment analysis
    let sentiment = 'neutral';
    if (lowerMessage.includes('interested') || lowerMessage.includes('tell me more') || lowerMessage.includes('sounds good')) {
      sentiment = 'positive';
    } else if (lowerMessage.includes('not interested') || lowerMessage.includes('stop') || lowerMessage.includes('unsubscribe')) {
      sentiment = 'negative';
    }

    // Intent detection
    let intent = 'general';
    if (lowerMessage.includes('meeting') || lowerMessage.includes('call') || lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      intent = 'meeting_interest';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      intent = 'pricing_inquiry';
    } else if (lowerMessage.includes('?')) {
      intent = 'question';
    }

    return { sentiment, intent };
  }

  private detectObjection(message: string): { type: Objection['type']; content: string } | null {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('too expensive') || lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      return { type: 'price', content: message };
    }
    if (lowerMessage.includes('not the right time') || lowerMessage.includes('maybe later') || lowerMessage.includes('next quarter')) {
      return { type: 'timing', content: message };
    }
    if (lowerMessage.includes('using') || lowerMessage.includes('competitor') || lowerMessage.includes('already have')) {
      return { type: 'competition', content: message };
    }
    if (lowerMessage.includes('need to check') || lowerMessage.includes('decision maker') || lowerMessage.includes('my boss')) {
      return { type: 'authority', content: message };
    }
    if (lowerMessage.includes('don\'t need') || lowerMessage.includes('not a priority')) {
      return { type: 'need', content: message };
    }

    return null;
  }

  private getObjectionPlaybook(type: Objection['type']): ObjectionPlaybook {
    const playbooks: Record<string, ObjectionPlaybook> = {
      price: {
        id: 'pb_price',
        objection_type: 'price',
        triggers: ['expensive', 'budget', 'cost'],
        responses: [
          {
            id: 'r1',
            response: "I completely understand budget is a key consideration. Many of our customers initially felt the same way, but found that the ROI typically covers the investment within 3 months. Would it help if I shared some specific examples of how similar companies achieved this?",
            tone: 'empathetic',
            effectiveness_score: 85,
            use_count: 150
          }
        ],
        escalation_threshold: 2
      },
      timing: {
        id: 'pb_timing',
        objection_type: 'timing',
        triggers: ['later', 'not now', 'next quarter'],
        responses: [
          {
            id: 'r1',
            response: "That makes sense - timing is everything. Just curious, what would need to change for this to become a priority? I'd love to stay in touch and reconnect when the timing is right for you.",
            tone: 'understanding',
            effectiveness_score: 78,
            use_count: 120
          }
        ],
        escalation_threshold: 2
      },
      competition: {
        id: 'pb_competition',
        objection_type: 'competition',
        triggers: ['already using', 'competitor', 'have a solution'],
        responses: [
          {
            id: 'r1',
            response: "Great to hear you're already addressing this! Out of curiosity, how's that working out for you? Many of our customers switched because of [specific differentiator]. Would you be open to a quick comparison?",
            tone: 'consultative',
            effectiveness_score: 72,
            use_count: 95
          }
        ],
        escalation_threshold: 2
      },
      authority: {
        id: 'pb_authority',
        objection_type: 'authority',
        triggers: ['check with', 'not my decision', 'need approval'],
        responses: [
          {
            id: 'r1',
            response: "Absolutely, it's important to have the right stakeholders involved. Would it be helpful if I put together a brief overview you could share with them? I'm also happy to join a call with your team if that would make things easier.",
            tone: 'helpful',
            effectiveness_score: 80,
            use_count: 88
          }
        ],
        escalation_threshold: 1
      },
      need: {
        id: 'pb_need',
        objection_type: 'need',
        triggers: ['don\'t need', 'not a priority', 'not relevant'],
        responses: [
          {
            id: 'r1',
            response: "I appreciate you being direct! Before I let you go - just curious what your current approach is for [problem]? Sometimes we find companies don't realize the impact until they see the data.",
            tone: 'curious',
            effectiveness_score: 65,
            use_count: 75
          }
        ],
        escalation_threshold: 1
      },
      trust: {
        id: 'pb_trust',
        objection_type: 'trust',
        triggers: ['never heard of', 'how do I know', 'references'],
        responses: [
          {
            id: 'r1',
            response: "That's a fair concern! We work with companies like [notable customers]. I'd be happy to connect you with a customer reference in your industry, or share some case studies. What would be most helpful?",
            tone: 'confident',
            effectiveness_score: 82,
            use_count: 60
          }
        ],
        escalation_threshold: 2
      },
      custom: {
        id: 'pb_custom',
        objection_type: 'custom',
        triggers: [],
        responses: [
          {
            id: 'r1',
            response: "That's a great point. Let me make sure I understand correctly - [paraphrase]. Is that right? I want to make sure I address your specific concern.",
            tone: 'clarifying',
            effectiveness_score: 70,
            use_count: 200
          }
        ],
        escalation_threshold: 1
      }
    };

    return playbooks[type] || playbooks.custom;
  }

  private async generateResponse(
    conversation: Conversation,
    message: string,
    analysis: { sentiment: string; intent: string },
    sdr: SDRPersona
  ): Promise<{ text: string; next_action: string; confidence: number }> {
    // Context-aware response generation
    const responseTemplates = {
      positive: [
        "That's great to hear! {follow_up}",
        "Wonderful! {next_step}",
        "I'm glad you're interested! {value_add}"
      ],
      neutral: [
        "Thanks for getting back to me. {clarification}",
        "I appreciate your response. {probe}",
        "Good question! {answer}"
      ],
      question: [
        "{direct_answer} Does that help clarify things?",
        "Great question! {detailed_answer}",
        "{answer} Would you like me to elaborate on anything?"
      ]
    };

    const templates = responseTemplates[analysis.sentiment as keyof typeof responseTemplates] || responseTemplates.neutral;
    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
      text: template.replace(/{.*?}/g, 'I\'d love to tell you more about how we can help'),
      next_action: analysis.intent === 'meeting_interest' ? 'propose_meeting' : 'await_response',
      confidence: 0.85
    };
  }

  private async proposeMeeting(conversation_id: string, sdr: SDRPersona): Promise<{ message: string }> {
    return {
      message: `That's great! I'd love to set up a quick call. Here are a few times that work for me this week:

• Tuesday at 2pm EST
• Wednesday at 10am EST
• Thursday at 3pm EST

Which works best for you? Or feel free to grab a time directly here: https://cal.orengen.io/${sdr.id}

Looking forward to chatting!`
    };
  }

  private makeFriendly(text: string): string {
    return text.replace(/\./g, '!').replace(/^/, 'Hey! ');
  }

  private makeFormal(text: string): string {
    return text.replace(/Hey/g, 'Dear').replace(/!/g, '.');
  }

  // Singleton
  async getAllSDRs(): Promise<SDRPersona[]> {
    return Array.from(this.personas.values());
  }

  async getAllConversations(sdr_id?: string): Promise<Conversation[]> {
    const conversations = Array.from(this.conversations.values());
    return sdr_id ? conversations.filter(c => c.sdr_id === sdr_id) : conversations;
  }

  async getAllSequences(sdr_id?: string): Promise<OutreachSequence[]> {
    const sequences = Array.from(this.sequences.values());
    return sdr_id ? sequences.filter(s => s.sdr_id === sdr_id) : sequences;
  }
}

export const aiSDRService = new AISDRService();
