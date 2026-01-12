/**
 * Email Service
 * Unified email sending via SendGrid, MailWizz, or SMTP
 * Supports templates, tracking, and sequences
 */

// Types
export interface EmailConfig {
  provider: 'sendgrid' | 'mailwizz' | 'smtp';
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}

export interface EmailMessage {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    contentType: string;
  }>;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  steps: EmailSequenceStep[];
  status: 'draft' | 'active' | 'paused';
}

export interface EmailSequenceStep {
  id: string;
  delay_days: number;
  delay_hours: number;
  subject: string;
  templateId?: string;
  html?: string;
  stopOnReply: boolean;
  stopOnClick: boolean;
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  complained: number;
}

// SendGrid Implementation
class SendGridProvider {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(config: EmailConfig) {
    this.apiKey = config.apiKey!;
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];

    const payload: any = {
      personalizations: [{
        to: recipients.map(email => ({ email })),
        ...(message.cc && { cc: message.cc.map(email => ({ email })) }),
        ...(message.bcc && { bcc: message.bcc.map(email => ({ email })) }),
        ...(message.templateData && { dynamic_template_data: message.templateData }),
      }],
      from: { email: this.fromEmail, name: this.fromName },
      subject: message.subject,
      ...(message.templateId && { template_id: message.templateId }),
      ...(message.html && !message.templateId && {
        content: [{ type: 'text/html', value: message.html }]
      }),
      ...(message.text && !message.html && !message.templateId && {
        content: [{ type: 'text/plain', value: message.text }]
      }),
      ...(message.tags && { categories: message.tags }),
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
    };

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error, provider: 'sendgrid' };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return { success: true, messageId, provider: 'sendgrid' };
    } catch (error: any) {
      return { success: false, error: error.message, provider: 'sendgrid' };
    }
  }
}

// MailWizz Implementation
class MailWizzProvider {
  private apiKey: string;
  private apiUrl: string;
  private fromEmail: string;
  private fromName: string;

  constructor(config: EmailConfig & { mailwizzUrl?: string }) {
    this.apiKey = config.apiKey!;
    this.apiUrl = config.smtpHost || 'https://your-mailwizz.com/api';
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];

    try {
      // MailWizz uses different endpoint structure
      const response = await fetch(`${this.apiUrl}/campaigns/send-transactional`, {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_email: recipients[0],
          to_name: '',
          from_email: this.fromEmail,
          from_name: this.fromName,
          subject: message.subject,
          body: message.html || message.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error, provider: 'mailwizz' };
      }

      const data = await response.json();
      return { success: true, messageId: data.message_id, provider: 'mailwizz' };
    } catch (error: any) {
      return { success: false, error: error.message, provider: 'mailwizz' };
    }
  }
}

// SMTP Implementation (using nodemailer pattern)
class SMTPProvider {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    // In production, use nodemailer
    // This is a placeholder showing the interface
    try {
      console.log('SMTP send:', {
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        to: message.to,
        subject: message.subject,
      });

      return {
        success: true,
        messageId: `smtp-${Date.now()}`,
        provider: 'smtp'
      };
    } catch (error: any) {
      return { success: false, error: error.message, provider: 'smtp' };
    }
  }
}

// Main Email Service
export class EmailService {
  private provider: SendGridProvider | MailWizzProvider | SMTPProvider;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;

    switch (config.provider) {
      case 'sendgrid':
        this.provider = new SendGridProvider(config);
        break;
      case 'mailwizz':
        this.provider = new MailWizzProvider(config);
        break;
      case 'smtp':
        this.provider = new SMTPProvider(config);
        break;
      default:
        throw new Error(`Unknown email provider: ${config.provider}`);
    }
  }

  // Send single email
  async send(message: EmailMessage): Promise<EmailResult> {
    return this.provider.send(message);
  }

  // Send bulk emails
  async sendBulk(messages: EmailMessage[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    // SendGrid supports batch, others need individual sends
    for (const message of messages) {
      const result = await this.send(message);
      results.push(result);

      // Rate limiting - 100ms between sends
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  // Send using template
  async sendTemplate(
    to: string | string[],
    templateId: string,
    data: Record<string, any>,
    options?: Partial<EmailMessage>
  ): Promise<EmailResult> {
    return this.send({
      to,
      subject: options?.subject || '',
      templateId,
      templateData: data,
      ...options,
    });
  }

  // Pre-built templates
  static templates = {
    newLeadNotification: (data: {
      domain: string;
      score: number;
      assignedTo?: string;
      dashboardUrl: string;
    }) => ({
      subject: `New Lead: ${data.domain} (Score: ${data.score})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">New Lead Received</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Domain:</strong> ${data.domain}</p>
            <p><strong>Lead Score:</strong> <span style="color: ${data.score >= 70 ? '#22c55e' : data.score >= 50 ? '#f59e0b' : '#ef4444'};">${data.score}/100</span></p>
            ${data.assignedTo ? `<p><strong>Assigned To:</strong> ${data.assignedTo}</p>` : ''}
          </div>
          <a href="${data.dashboardUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Lead</a>
        </div>
      `,
    }),

    slaWarning: (data: {
      domain: string;
      minutesRemaining: number;
      assignedTo: string;
      dashboardUrl: string;
    }) => ({
      subject: `SLA Warning: ${data.domain} - ${data.minutesRemaining}min remaining`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">SLA Warning</h2>
          <p>The following lead requires immediate attention:</p>
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p><strong>Domain:</strong> ${data.domain}</p>
            <p><strong>Time Remaining:</strong> ${data.minutesRemaining} minutes</p>
            <p><strong>Assigned To:</strong> ${data.assignedTo}</p>
          </div>
          <a href="${data.dashboardUrl}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Take Action</a>
        </div>
      `,
    }),

    slaBreach: (data: {
      domain: string;
      assignedTo: string;
      breachTime: string;
      dashboardUrl: string;
    }) => ({
      subject: `SLA BREACH: ${data.domain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">SLA Breach Alert</h2>
          <p>The SLA has been breached for the following lead:</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p><strong>Domain:</strong> ${data.domain}</p>
            <p><strong>Assigned To:</strong> ${data.assignedTo}</p>
            <p><strong>Breach Time:</strong> ${data.breachTime}</p>
          </div>
          <a href="${data.dashboardUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Respond Now</a>
        </div>
      `,
    }),

    leadConverted: (data: {
      domain: string;
      companyName: string;
      contactName: string;
      convertedBy: string;
    }) => ({
      subject: `Lead Converted: ${data.domain} is now ${data.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Lead Converted!</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <p><strong>Domain:</strong> ${data.domain}</p>
            <p><strong>Company:</strong> ${data.companyName}</p>
            <p><strong>Primary Contact:</strong> ${data.contactName}</p>
            <p><strong>Converted By:</strong> ${data.convertedBy}</p>
          </div>
        </div>
      `,
    }),

    welcomeEmail: (data: {
      name: string;
      companyName: string;
      loginUrl: string;
    }) => ({
      subject: `Welcome to ${data.companyName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome, ${data.name}!</h2>
          <p>Your account has been created at ${data.companyName}.</p>
          <a href="${data.loginUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px;">Login to Dashboard</a>
        </div>
      `,
    }),

    outreachSequence: {
      step1: (data: { firstName: string; companyName: string; value: string }) => ({
        subject: `Quick question about ${data.companyName}`,
        html: `
          <p>Hi ${data.firstName},</p>
          <p>I noticed ${data.companyName} and thought our ${data.value} could be valuable for your team.</p>
          <p>Would you be open to a quick 15-minute call this week?</p>
          <p>Best,<br/>{{sender_name}}</p>
        `,
      }),
      step2: (data: { firstName: string }) => ({
        subject: `Following up`,
        html: `
          <p>Hi ${data.firstName},</p>
          <p>Just wanted to bump this to the top of your inbox. I know things get busy.</p>
          <p>Would a call work better next week?</p>
          <p>Best,<br/>{{sender_name}}</p>
        `,
      }),
      step3: (data: { firstName: string }) => ({
        subject: `Last try`,
        html: `
          <p>Hi ${data.firstName},</p>
          <p>I'll keep this brief - is now not a good time, or is this just not relevant?</p>
          <p>Either way, happy to help whenever you're ready.</p>
          <p>Best,<br/>{{sender_name}}</p>
        `,
      }),
    },
  };
}

// Factory function
export function createEmailService(config: EmailConfig): EmailService {
  return new EmailService(config);
}

// Get config from environment
export function getEmailConfigFromEnv(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER || 'sendgrid') as EmailConfig['provider'];

  return {
    provider,
    apiKey: process.env.SENDGRID_API_KEY || process.env.MAILWIZZ_API_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    fromEmail: process.env.EMAIL_FROM || 'noreply@example.com',
    fromName: process.env.EMAIL_FROM_NAME || 'OrenGen CRM',
    replyTo: process.env.EMAIL_REPLY_TO,
    trackOpens: true,
    trackClicks: true,
  };
}
