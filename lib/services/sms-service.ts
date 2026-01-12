/**
 * SMS & WhatsApp Service
 * Twilio integration for instant lead notifications and outreach
 */

// Types
export interface SMSConfig {
  provider: 'twilio';
  accountSid: string;
  authToken: string;
  fromNumber: string;
  whatsappNumber?: string;
  messagingServiceSid?: string;
}

export interface SMSMessage {
  to: string;
  body: string;
  mediaUrl?: string[];
  statusCallback?: string;
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  templateSid?: string;
  templateVariables?: Record<string, string>;
  mediaUrl?: string[];
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
  segments?: number;
}

export interface SMSStats {
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
}

// Twilio Implementation
class TwilioProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  private whatsappNumber: string;
  private messagingServiceSid?: string;

  constructor(config: SMSConfig) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.fromNumber = config.fromNumber;
    this.whatsappNumber = config.whatsappNumber || config.fromNumber;
    this.messagingServiceSid = config.messagingServiceSid;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async sendSMS(message: SMSMessage): Promise<SMSResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

    const body = new URLSearchParams({
      To: message.to,
      Body: message.body,
      ...(this.messagingServiceSid
        ? { MessagingServiceSid: this.messagingServiceSid }
        : { From: this.fromNumber }
      ),
      ...(message.statusCallback && { StatusCallback: message.statusCallback }),
    });

    if (message.mediaUrl) {
      message.mediaUrl.forEach(url => body.append('MediaUrl', url));
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send SMS',
        };
      }

      return {
        success: true,
        messageId: data.sid,
        status: data.status,
        segments: data.num_segments ? parseInt(data.num_segments) : 1,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendWhatsApp(message: WhatsAppMessage): Promise<SMSResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

    // WhatsApp numbers must be prefixed with 'whatsapp:'
    const toNumber = message.to.startsWith('whatsapp:')
      ? message.to
      : `whatsapp:${message.to}`;

    const fromNumber = this.whatsappNumber.startsWith('whatsapp:')
      ? this.whatsappNumber
      : `whatsapp:${this.whatsappNumber}`;

    const body = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Body: message.body,
    });

    // For template messages
    if (message.templateSid) {
      body.set('ContentSid', message.templateSid);
      if (message.templateVariables) {
        body.set('ContentVariables', JSON.stringify(message.templateVariables));
      }
    }

    if (message.mediaUrl) {
      message.mediaUrl.forEach(url => body.append('MediaUrl', url));
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send WhatsApp message',
        };
      }

      return {
        success: true,
        messageId: data.sid,
        status: data.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getMessageStatus(messageSid: string): Promise<{
    status: string;
    errorCode?: number;
    errorMessage?: string;
  }> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages/${messageSid}.json`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      const data = await response.json();

      return {
        status: data.status,
        errorCode: data.error_code,
        errorMessage: data.error_message,
      };
    } catch (error) {
      return { status: 'unknown' };
    }
  }

  // Validate phone number
  async validateNumber(phoneNumber: string): Promise<{
    valid: boolean;
    formatted?: string;
    type?: string;
    carrier?: string;
  }> {
    const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneNumber)}?Fields=line_type_intelligence`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();

      return {
        valid: data.valid,
        formatted: data.phone_number,
        type: data.line_type_intelligence?.type,
        carrier: data.line_type_intelligence?.carrier_name,
      };
    } catch (error) {
      return { valid: false };
    }
  }
}

// Main SMS Service
export class SMSService {
  private provider: TwilioProvider;
  private config: SMSConfig;

  constructor(config: SMSConfig) {
    this.config = config;
    this.provider = new TwilioProvider(config);
  }

  // Send SMS
  async sendSMS(to: string, body: string, options?: Partial<SMSMessage>): Promise<SMSResult> {
    return this.provider.sendSMS({ to, body, ...options });
  }

  // Send WhatsApp message
  async sendWhatsApp(to: string, body: string, options?: Partial<WhatsAppMessage>): Promise<SMSResult> {
    return this.provider.sendWhatsApp({ to, body, ...options });
  }

  // Send to multiple recipients
  async sendBulkSMS(recipients: string[], body: string): Promise<SMSResult[]> {
    const results: SMSResult[] = [];

    for (const to of recipients) {
      const result = await this.sendSMS(to, body);
      results.push(result);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  // Validate phone number
  async validateNumber(phoneNumber: string) {
    return this.provider.validateNumber(phoneNumber);
  }

  // Get message status
  async getStatus(messageSid: string) {
    return this.provider.getMessageStatus(messageSid);
  }

  // Pre-built message templates
  static templates = {
    newLeadAlert: (data: { domain: string; score: number }) =>
      `New lead: ${data.domain} (Score: ${data.score}). Check dashboard for details.`,

    slaWarning: (data: { domain: string; minutes: number }) =>
      `SLA Warning: ${data.domain} needs response in ${data.minutes} min.`,

    slaBreach: (data: { domain: string }) =>
      `SLA BREACH: ${data.domain} - Immediate action required!`,

    leadAssigned: (data: { domain: string; assignedTo: string }) =>
      `Lead assigned: ${data.domain} is now assigned to ${data.assignedTo}.`,

    meetingReminder: (data: { contactName: string; time: string }) =>
      `Reminder: Meeting with ${data.contactName} at ${data.time}.`,

    followUpReminder: (data: { companyName: string; daysAgo: number }) =>
      `Follow-up needed: ${data.companyName} (last contact: ${data.daysAgo} days ago).`,
  };
}

// Factory function
export function createSMSService(config: SMSConfig): SMSService {
  return new SMSService(config);
}

// Get config from environment
export function getSMSConfigFromEnv(): SMSConfig {
  return {
    provider: 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    fromNumber: process.env.TWILIO_PHONE_NUMBER!,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  };
}
