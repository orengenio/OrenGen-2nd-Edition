/**
 * SIM/Number Integration Service
 * Route calls and SMS through CRM using personal phone numbers
 *
 * UNIQUE DIFFERENTIATOR: Unlike competitors who force Twilio numbers,
 * this allows users to use their REAL phone numbers while routing
 * all communications through the CRM - appearing authentic while
 * keeping personal devices clean.
 *
 * Supports:
 * - Number porting to VoIP
 * - Call forwarding configuration
 * - Dual-SIM routing
 * - eSIM provisioning
 * - Carrier API integration
 */

// Types
export interface ConnectedNumber {
  id: string;
  phoneNumber: string;
  displayName: string;
  type: NumberType;
  carrier?: string;
  status: NumberStatus;
  routingMode: RoutingMode;
  forwardingRules: ForwardingRule[];
  voicemailEnabled: boolean;
  voicemailGreeting?: string;
  callRecordingEnabled: boolean;
  smsEnabled: boolean;
  mmsEnabled: boolean;
  capabilities: NumberCapabilities;
  monthlyUsage: UsageStats;
  connectedAt: string;
  lastActivity?: string;
  tenantId: string;
}

export type NumberType =
  | 'personal_mobile'    // Personal cell phone (SIM)
  | 'personal_landline'  // Personal landline
  | 'business_line'      // Existing business line
  | 'ported_number'      // Number ported to VoIP
  | 'virtual_number'     // Pure VoIP/Twilio number
  | 'esim_number';       // eSIM provisioned number

export type NumberStatus =
  | 'active'
  | 'pending_verification'
  | 'pending_port'
  | 'suspended'
  | 'disconnected';

export type RoutingMode =
  | 'crm_only'           // All calls/SMS go through CRM only
  | 'crm_primary'        // CRM first, fallback to device
  | 'device_primary'     // Device first, overflow to CRM
  | 'smart_routing'      // AI decides based on context
  | 'schedule_based';    // Different routing by time

export interface ForwardingRule {
  id: string;
  name: string;
  priority: number;
  conditions: RuleCondition[];
  action: RuleAction;
  schedule?: Schedule;
  isActive: boolean;
}

export interface RuleCondition {
  type: 'caller_id' | 'time_of_day' | 'day_of_week' | 'contact_tag' | 'keyword' | 'all';
  operator: 'equals' | 'contains' | 'starts_with' | 'in_list' | 'not_in_list' | 'between';
  value: string | string[] | number[];
}

export interface RuleAction {
  type: 'route_to_crm' | 'route_to_device' | 'route_to_voicemail' | 'route_to_number' | 'block' | 'ai_agent';
  destination?: string;
  aiAgentId?: string;
  playMessage?: string;
}

export interface Schedule {
  timezone: string;
  rules: ScheduleRule[];
}

export interface ScheduleRule {
  days: number[]; // 0-6
  startTime: string; // HH:MM
  endTime: string;
  action: RuleAction;
}

export interface NumberCapabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax: boolean;
  voicemail: boolean;
  callRecording: boolean;
  conferencing: boolean;
  ivr: boolean;
}

export interface UsageStats {
  inboundCalls: number;
  outboundCalls: number;
  inboundSms: number;
  outboundSms: number;
  inboundMms: number;
  outboundMms: number;
  voicemailsReceived: number;
  totalMinutes: number;
  recordedMinutes: number;
}

export interface CallRecord {
  id: string;
  numberId: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: 'ringing' | 'in-progress' | 'completed' | 'missed' | 'busy' | 'failed' | 'voicemail';
  duration: number;
  startTime: string;
  endTime?: string;
  recordingUrl?: string;
  transcription?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  contactId?: string;
  dealId?: string;
  notes?: string;
  routedTo: 'crm' | 'device' | 'voicemail' | 'ai_agent';
  aiAgentId?: string;
}

export interface SmsRecord {
  id: string;
  numberId: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  body: string;
  mediaUrls?: string[];
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'received';
  sentAt: string;
  deliveredAt?: string;
  contactId?: string;
  threadId: string;
  isAutomated: boolean;
  automationId?: string;
}

export interface CarrierConfig {
  carrier: string;
  apiEndpoint?: string;
  apiKey?: string;
  accountId?: string;
  supportsForwarding: boolean;
  supportsConditionalForwarding: boolean;
  supportsSimSwap: boolean;
  forwardingCodes?: {
    enable: string;
    disable: string;
    conditional: string;
  };
}

// Supported carriers
const CARRIER_CONFIGS: Record<string, CarrierConfig> = {
  verizon: {
    carrier: 'Verizon',
    supportsForwarding: true,
    supportsConditionalForwarding: true,
    supportsSimSwap: false,
    forwardingCodes: {
      enable: '*72',
      disable: '*73',
      conditional: '*71',
    },
  },
  att: {
    carrier: 'AT&T',
    supportsForwarding: true,
    supportsConditionalForwarding: true,
    supportsSimSwap: false,
    forwardingCodes: {
      enable: '*72',
      disable: '*73',
      conditional: '*92',
    },
  },
  tmobile: {
    carrier: 'T-Mobile',
    supportsForwarding: true,
    supportsConditionalForwarding: true,
    supportsSimSwap: true,
    forwardingCodes: {
      enable: '**21*',
      disable: '##21#',
      conditional: '**61*',
    },
  },
  sprint: {
    carrier: 'Sprint',
    supportsForwarding: true,
    supportsConditionalForwarding: true,
    supportsSimSwap: false,
    forwardingCodes: {
      enable: '*72',
      disable: '*720',
      conditional: '*73',
    },
  },
};

// Main Service Class
export class SIMIntegrationService {
  private numbers: Map<string, ConnectedNumber> = new Map();
  private callRecords: CallRecord[] = [];
  private smsRecords: SmsRecord[] = [];
  private twilioClient: any; // Would be actual Twilio client
  private tenantId: string;
  private crmInboundNumber: string; // Central CRM number for forwarding

  constructor(
    tenantId: string,
    twilioConfig: { accountSid: string; authToken: string; crmNumber: string }
  ) {
    this.tenantId = tenantId;
    this.crmInboundNumber = twilioConfig.crmNumber;
    // Initialize Twilio client in production
  }

  // Connect a personal phone number
  async connectNumber(params: {
    phoneNumber: string;
    displayName: string;
    type: NumberType;
    carrier?: string;
    routingMode?: RoutingMode;
  }): Promise<ConnectedNumber> {
    const number: ConnectedNumber = {
      id: `num_${Date.now()}`,
      phoneNumber: this.formatPhoneNumber(params.phoneNumber),
      displayName: params.displayName,
      type: params.type,
      carrier: params.carrier,
      status: 'pending_verification',
      routingMode: params.routingMode || 'crm_primary',
      forwardingRules: [],
      voicemailEnabled: true,
      callRecordingEnabled: false,
      smsEnabled: params.type !== 'personal_landline',
      mmsEnabled: params.type !== 'personal_landline',
      capabilities: this.getDefaultCapabilities(params.type),
      monthlyUsage: this.getEmptyUsageStats(),
      connectedAt: new Date().toISOString(),
      tenantId: this.tenantId,
    };

    this.numbers.set(number.id, number);

    // Send verification code
    await this.sendVerificationCode(number);

    return number;
  }

  // Verify number ownership
  async verifyNumber(numberId: string, code: string): Promise<boolean> {
    const number = this.numbers.get(numberId);
    if (!number) {
      throw new Error('Number not found');
    }

    // In production, verify the code
    // For demo, accept any 6-digit code
    if (code.length === 6) {
      number.status = 'active';
      return true;
    }

    return false;
  }

  // Configure call forwarding on carrier
  async configureForwarding(
    numberId: string,
    mode: 'all' | 'busy' | 'no_answer' | 'unreachable'
  ): Promise<{ success: boolean; instructions?: string }> {
    const number = this.numbers.get(numberId);
    if (!number) {
      throw new Error('Number not found');
    }

    const carrierConfig = CARRIER_CONFIGS[number.carrier?.toLowerCase() || ''];

    if (!carrierConfig) {
      // Return manual instructions for unknown carriers
      return {
        success: false,
        instructions: `To forward calls from ${number.phoneNumber} to your CRM:
1. Open your phone's dial pad
2. Dial *72${this.crmInboundNumber} (for all calls)
   Or dial *71${this.crmInboundNumber} (for busy/no answer)
3. Press call and wait for confirmation tone
4. Your calls will now route through the CRM

To disable: Dial *73 and press call`,
      };
    }

    // Generate carrier-specific instructions
    const forwardTo = this.crmInboundNumber.replace(/[^0-9]/g, '');
    let dialCode = '';

    switch (mode) {
      case 'all':
        dialCode = `${carrierConfig.forwardingCodes?.enable}${forwardTo}`;
        break;
      case 'busy':
      case 'no_answer':
      case 'unreachable':
        dialCode = `${carrierConfig.forwardingCodes?.conditional}${forwardTo}`;
        break;
    }

    return {
      success: true,
      instructions: `To enable ${mode} forwarding on ${carrierConfig.carrier}:
1. Open your phone's dial pad
2. Dial: ${dialCode}
3. Press call and wait for confirmation
4. Done! Calls will route to your CRM

To disable: Dial ${carrierConfig.forwardingCodes?.disable}`,
    };
  }

  // Port number to VoIP (full CRM control)
  async initiatePorting(
    numberId: string,
    portingDetails: {
      accountNumber: string;
      accountPin?: string;
      accountName: string;
      serviceAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
    }
  ): Promise<{ portId: string; estimatedCompletion: string; status: string }> {
    const number = this.numbers.get(numberId);
    if (!number) {
      throw new Error('Number not found');
    }

    // In production, this would submit to Twilio/carrier for porting
    number.status = 'pending_port';
    number.type = 'ported_number';

    const estimatedDays = 5 + Math.floor(Math.random() * 5);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return {
      portId: `port_${Date.now()}`,
      estimatedCompletion: completionDate.toISOString(),
      status: 'submitted',
    };
  }

  // Add forwarding rule
  addForwardingRule(numberId: string, rule: Omit<ForwardingRule, 'id'>): ForwardingRule {
    const number = this.numbers.get(numberId);
    if (!number) {
      throw new Error('Number not found');
    }

    const fullRule: ForwardingRule = {
      ...rule,
      id: `rule_${Date.now()}`,
    };

    number.forwardingRules.push(fullRule);
    number.forwardingRules.sort((a, b) => a.priority - b.priority);

    return fullRule;
  }

  // Get all connected numbers
  getNumbers(): ConnectedNumber[] {
    return Array.from(this.numbers.values());
  }

  // Get single number
  getNumber(numberId: string): ConnectedNumber | undefined {
    return this.numbers.get(numberId);
  }

  // Handle inbound call
  async handleInboundCall(
    to: string,
    from: string,
    callSid: string
  ): Promise<{ action: string; destination?: string; twiml?: string }> {
    // Find the connected number
    const number = Array.from(this.numbers.values())
      .find(n => this.normalizeNumber(n.phoneNumber) === this.normalizeNumber(to));

    if (!number) {
      return { action: 'reject', twiml: '<Response><Reject/></Response>' };
    }

    // Create call record
    const callRecord: CallRecord = {
      id: `call_${Date.now()}`,
      numberId: number.id,
      direction: 'inbound',
      from,
      to,
      status: 'ringing',
      duration: 0,
      startTime: new Date().toISOString(),
      routedTo: 'crm',
    };
    this.callRecords.push(callRecord);

    // Evaluate forwarding rules
    const rule = this.evaluateForwardingRules(number, from);

    if (rule) {
      callRecord.routedTo = rule.action.type === 'route_to_device' ? 'device' : 'crm';

      switch (rule.action.type) {
        case 'route_to_device':
          return {
            action: 'forward',
            destination: number.phoneNumber,
            twiml: `<Response><Dial>${number.phoneNumber}</Dial></Response>`,
          };

        case 'route_to_voicemail':
          callRecord.routedTo = 'voicemail';
          return {
            action: 'voicemail',
            twiml: `<Response>
              <Say>${number.voicemailGreeting || 'Please leave a message after the beep.'}</Say>
              <Record maxLength="120" transcribe="true" />
            </Response>`,
          };

        case 'ai_agent':
          callRecord.routedTo = 'ai_agent';
          callRecord.aiAgentId = rule.action.aiAgentId;
          return {
            action: 'ai_agent',
            destination: rule.action.aiAgentId,
          };

        case 'block':
          callRecord.status = 'failed';
          return { action: 'reject', twiml: '<Response><Reject reason="rejected"/></Response>' };
      }
    }

    // Default: route to CRM softphone
    return {
      action: 'crm',
      twiml: `<Response>
        <Dial>
          <Client>crm_${this.tenantId}</Client>
        </Dial>
      </Response>`,
    };
  }

  // Make outbound call through CRM
  async makeCall(
    numberId: string,
    to: string,
    options?: { recordCall?: boolean; contactId?: string; dealId?: string }
  ): Promise<CallRecord> {
    const number = this.numbers.get(numberId);
    if (!number || number.status !== 'active') {
      throw new Error('Number not available');
    }

    const callRecord: CallRecord = {
      id: `call_${Date.now()}`,
      numberId,
      direction: 'outbound',
      from: number.phoneNumber,
      to,
      status: 'ringing',
      duration: 0,
      startTime: new Date().toISOString(),
      routedTo: 'crm',
      contactId: options?.contactId,
      dealId: options?.dealId,
    };

    this.callRecords.push(callRecord);

    // In production, this would initiate call via Twilio
    // using number.phoneNumber as caller ID

    return callRecord;
  }

  // Send SMS through CRM
  async sendSms(
    numberId: string,
    to: string,
    body: string,
    options?: { mediaUrls?: string[]; contactId?: string; isAutomated?: boolean; automationId?: string }
  ): Promise<SmsRecord> {
    const number = this.numbers.get(numberId);
    if (!number || number.status !== 'active' || !number.smsEnabled) {
      throw new Error('SMS not available for this number');
    }

    const smsRecord: SmsRecord = {
      id: `sms_${Date.now()}`,
      numberId,
      direction: 'outbound',
      from: number.phoneNumber,
      to,
      body,
      mediaUrls: options?.mediaUrls,
      status: 'queued',
      sentAt: new Date().toISOString(),
      contactId: options?.contactId,
      threadId: this.getOrCreateThreadId(number.phoneNumber, to),
      isAutomated: options?.isAutomated || false,
      automationId: options?.automationId,
    };

    this.smsRecords.push(smsRecord);

    // In production, send via Twilio using number.phoneNumber as sender
    smsRecord.status = 'sent';

    // Update usage
    number.monthlyUsage.outboundSms++;

    return smsRecord;
  }

  // Handle inbound SMS
  async handleInboundSms(
    to: string,
    from: string,
    body: string,
    mediaUrls?: string[]
  ): Promise<SmsRecord> {
    const number = Array.from(this.numbers.values())
      .find(n => this.normalizeNumber(n.phoneNumber) === this.normalizeNumber(to));

    if (!number) {
      throw new Error('Number not found');
    }

    const smsRecord: SmsRecord = {
      id: `sms_${Date.now()}`,
      numberId: number.id,
      direction: 'inbound',
      from,
      to,
      body,
      mediaUrls,
      status: 'received',
      sentAt: new Date().toISOString(),
      threadId: this.getOrCreateThreadId(number.phoneNumber, from),
      isAutomated: false,
    };

    this.smsRecords.push(smsRecord);

    // Update usage
    number.monthlyUsage.inboundSms++;
    if (mediaUrls && mediaUrls.length > 0) {
      number.monthlyUsage.inboundMms++;
    }

    return smsRecord;
  }

  // Get call history
  getCallHistory(numberId?: string, limit: number = 50): CallRecord[] {
    let records = [...this.callRecords];

    if (numberId) {
      records = records.filter(r => r.numberId === numberId);
    }

    return records
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  // Get SMS history
  getSmsHistory(numberId?: string, limit: number = 50): SmsRecord[] {
    let records = [...this.smsRecords];

    if (numberId) {
      records = records.filter(r => r.numberId === numberId);
    }

    return records
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
      .slice(0, limit);
  }

  // Get conversation thread
  getThread(threadId: string): SmsRecord[] {
    return this.smsRecords
      .filter(r => r.threadId === threadId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }

  // Enable/disable call recording
  setCallRecording(numberId: string, enabled: boolean): void {
    const number = this.numbers.get(numberId);
    if (number) {
      number.callRecordingEnabled = enabled;
    }
  }

  // Set voicemail greeting
  setVoicemailGreeting(numberId: string, greeting: string): void {
    const number = this.numbers.get(numberId);
    if (number) {
      number.voicemailGreeting = greeting;
    }
  }

  // Get usage statistics
  getUsageStats(numberId: string): UsageStats | null {
    const number = this.numbers.get(numberId);
    return number?.monthlyUsage || null;
  }

  // Helper methods
  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+${digits}`;
  }

  private normalizeNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  private getOrCreateThreadId(num1: string, num2: string): string {
    const sorted = [this.normalizeNumber(num1), this.normalizeNumber(num2)].sort();
    return `thread_${sorted[0]}_${sorted[1]}`;
  }

  private getDefaultCapabilities(type: NumberType): NumberCapabilities {
    return {
      voice: true,
      sms: type !== 'personal_landline',
      mms: type !== 'personal_landline',
      fax: type === 'business_line' || type === 'ported_number',
      voicemail: true,
      callRecording: true,
      conferencing: type === 'ported_number' || type === 'virtual_number',
      ivr: type === 'ported_number' || type === 'virtual_number',
    };
  }

  private getEmptyUsageStats(): UsageStats {
    return {
      inboundCalls: 0,
      outboundCalls: 0,
      inboundSms: 0,
      outboundSms: 0,
      inboundMms: 0,
      outboundMms: 0,
      voicemailsReceived: 0,
      totalMinutes: 0,
      recordedMinutes: 0,
    };
  }

  private async sendVerificationCode(number: ConnectedNumber): Promise<void> {
    // In production, send SMS with verification code
    console.log(`Sending verification code to ${number.phoneNumber}`);
  }

  private evaluateForwardingRules(
    number: ConnectedNumber,
    callerId: string
  ): ForwardingRule | null {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    for (const rule of number.forwardingRules) {
      if (!rule.isActive) continue;

      // Check schedule
      if (rule.schedule) {
        const inSchedule = rule.schedule.rules.some(sr => {
          if (!sr.days.includes(currentDay)) return false;
          const [startH, startM] = sr.startTime.split(':').map(Number);
          const [endH, endM] = sr.endTime.split(':').map(Number);
          const currentMinutes = currentHour * 60 + now.getMinutes();
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
        });
        if (!inSchedule) continue;
      }

      // Check conditions
      const conditionsMet = rule.conditions.every(cond => {
        switch (cond.type) {
          case 'all':
            return true;
          case 'caller_id':
            return this.matchCondition(callerId, cond);
          case 'time_of_day':
            return this.matchCondition(String(currentHour), cond);
          case 'day_of_week':
            return this.matchCondition(String(currentDay), cond);
          default:
            return true;
        }
      });

      if (conditionsMet) {
        return rule;
      }
    }

    return null;
  }

  private matchCondition(value: string, condition: RuleCondition): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return value.includes(condition.value as string);
      case 'starts_with':
        return value.startsWith(condition.value as string);
      case 'in_list':
        return (condition.value as string[]).includes(value);
      case 'not_in_list':
        return !(condition.value as string[]).includes(value);
      default:
        return false;
    }
  }
}

// Factory function
export function createSIMIntegrationService(
  tenantId: string,
  twilioConfig: { accountSid: string; authToken: string; crmNumber: string }
): SIMIntegrationService {
  return new SIMIntegrationService(tenantId, twilioConfig);
}

// Common forwarding rule templates
export const FORWARDING_RULE_TEMPLATES = {
  businessHours: {
    name: 'Business Hours to CRM',
    priority: 1,
    conditions: [{ type: 'all' as const, operator: 'equals' as const, value: 'true' }],
    action: { type: 'route_to_crm' as const },
    schedule: {
      timezone: 'America/New_York',
      rules: [
        { days: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00', action: { type: 'route_to_crm' as const } },
      ],
    },
  },
  afterHoursVoicemail: {
    name: 'After Hours to Voicemail',
    priority: 2,
    conditions: [{ type: 'all' as const, operator: 'equals' as const, value: 'true' }],
    action: { type: 'route_to_voicemail' as const },
    schedule: {
      timezone: 'America/New_York',
      rules: [
        { days: [1, 2, 3, 4, 5], startTime: '17:00', endTime: '23:59', action: { type: 'route_to_voicemail' as const } },
        { days: [1, 2, 3, 4, 5], startTime: '00:00', endTime: '09:00', action: { type: 'route_to_voicemail' as const } },
        { days: [0, 6], startTime: '00:00', endTime: '23:59', action: { type: 'route_to_voicemail' as const } },
      ],
    },
  },
  vipToDevice: {
    name: 'VIP Callers to Personal Device',
    priority: 0,
    conditions: [{ type: 'contact_tag' as const, operator: 'in_list' as const, value: ['vip', 'priority'] }],
    action: { type: 'route_to_device' as const },
  },
  aiAgentHandler: {
    name: 'Unknown Callers to AI Agent',
    priority: 3,
    conditions: [{ type: 'contact_tag' as const, operator: 'not_in_list' as const, value: ['known', 'customer'] }],
    action: { type: 'ai_agent' as const, aiAgentId: 'default_qualifier' },
  },
};
