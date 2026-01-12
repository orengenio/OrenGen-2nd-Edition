// Email Infrastructure Service (Instantly.ai + ReachInbox competitor)
// Email warmup, deliverability, unlimited accounts, unified inbox

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'google' | 'outlook' | 'smtp' | 'orenmail';
  status: 'active' | 'warming' | 'paused' | 'suspended';
  warmup_status: WarmupStatus;
  health_score: number;
  daily_limit: number;
  sent_today: number;
  domain: string;
  created_at: Date;
  last_activity: Date;
}

export interface WarmupStatus {
  enabled: boolean;
  day: number;
  total_days: number;
  emails_per_day: number;
  target_emails_per_day: number;
  reputation_score: number;
  inbox_placement_rate: number;
  spam_rate: number;
  reply_rate: number;
}

export interface EmailDomain {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'failed';
  dns_records: DNSRecord[];
  health: DomainHealth;
  accounts: string[];
  created_at: Date;
}

export interface DNSRecord {
  type: 'SPF' | 'DKIM' | 'DMARC' | 'MX' | 'A' | 'CNAME';
  name: string;
  value: string;
  status: 'valid' | 'invalid' | 'missing';
  required: boolean;
}

export interface DomainHealth {
  spf_valid: boolean;
  dkim_valid: boolean;
  dmarc_valid: boolean;
  blacklist_status: 'clean' | 'listed';
  blacklists_checked: number;
  blacklists_listed: string[];
  age_days: number;
  reputation_score: number;
}

export interface UnifiedInbox {
  id: string;
  accounts: string[];
  total_emails: number;
  unread: number;
  needs_reply: number;
  starred: number;
  folders: InboxFolder[];
}

export interface InboxFolder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'custom';
  count: number;
  unread: number;
}

export interface EmailThread {
  id: string;
  account_id: string;
  lead_email: string;
  lead_name: string;
  lead_company?: string;
  subject: string;
  messages: EmailMessage[];
  status: 'active' | 'replied' | 'bounced' | 'unsubscribed';
  sentiment: 'positive' | 'neutral' | 'negative' | 'interested';
  labels: string[];
  campaign_id?: string;
  sequence_step?: number;
  ai_summary?: string;
  suggested_reply?: string;
  starred: boolean;
  snoozed_until?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EmailMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body_html: string;
  body_text: string;
  attachments: Attachment[];
  timestamp: Date;
  read: boolean;
  tracking: EmailTracking;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  mime_type: string;
  url: string;
}

export interface EmailTracking {
  opened: boolean;
  open_count: number;
  first_opened?: Date;
  last_opened?: Date;
  clicked: boolean;
  click_count: number;
  links_clicked: string[];
  device?: string;
  location?: string;
}

export interface ColdEmailCampaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  accounts: string[];
  leads: CampaignLead[];
  sequence: EmailSequence;
  settings: CampaignSettings;
  stats: CampaignStats;
  created_at: Date;
  updated_at: Date;
}

export interface CampaignLead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  title?: string;
  custom_fields: Record<string, string>;
  status: 'pending' | 'active' | 'replied' | 'bounced' | 'unsubscribed' | 'completed';
  current_step: number;
  last_email_sent?: Date;
  next_email_scheduled?: Date;
}

export interface EmailSequence {
  id: string;
  steps: SequenceStep[];
  ab_testing: boolean;
}

export interface SequenceStep {
  id: string;
  order: number;
  type: 'email' | 'wait' | 'condition';
  delay_days: number;
  delay_hours: number;
  subject: string;
  body: string;
  variants?: { subject: string; body: string }[];
  send_time: 'immediate' | 'optimal' | 'scheduled';
  scheduled_time?: string;
}

export interface CampaignSettings {
  daily_limit_per_account: number;
  send_window: { start: string; end: string };
  timezone: string;
  skip_weekends: boolean;
  stop_on_reply: boolean;
  stop_on_auto_reply: boolean;
  track_opens: boolean;
  track_clicks: boolean;
  unsubscribe_link: boolean;
  custom_tracking_domain?: string;
}

export interface CampaignStats {
  total_leads: number;
  emails_sent: number;
  emails_delivered: number;
  emails_opened: number;
  emails_clicked: number;
  emails_replied: number;
  emails_bounced: number;
  unsubscribed: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  bounce_rate: number;
}

export interface DeliverabilityReport {
  account_id: string;
  period: 'day' | 'week' | 'month';
  inbox_placement: number;
  spam_placement: number;
  missing: number;
  provider_breakdown: {
    provider: string;
    inbox_rate: number;
    spam_rate: number;
  }[];
  issues: DeliverabilityIssue[];
  recommendations: string[];
}

export interface DeliverabilityIssue {
  type: 'dns' | 'content' | 'reputation' | 'volume' | 'engagement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  fix: string;
}

class EmailInfrastructureService {
  private accounts: Map<string, EmailAccount> = new Map();
  private domains: Map<string, EmailDomain> = new Map();
  private threads: Map<string, EmailThread> = new Map();
  private campaigns: Map<string, ColdEmailCampaign> = new Map();

  // Account Management
  async addEmailAccount(config: {
    email: string;
    password?: string;
    oauth_token?: string;
    smtp_config?: {
      host: string;
      port: number;
      username: string;
      password: string;
    };
  }): Promise<EmailAccount> {
    const domain = config.email.split('@')[1];
    const provider = this.detectProvider(domain);

    const account: EmailAccount = {
      id: `acc_${Date.now()}`,
      email: config.email,
      provider,
      status: 'warming',
      warmup_status: {
        enabled: true,
        day: 1,
        total_days: 28,
        emails_per_day: 5,
        target_emails_per_day: 50,
        reputation_score: 50,
        inbox_placement_rate: 0,
        spam_rate: 0,
        reply_rate: 0
      },
      health_score: 50,
      daily_limit: 5,
      sent_today: 0,
      domain,
      created_at: new Date(),
      last_activity: new Date()
    };

    this.accounts.set(account.id, account);

    // Auto-add domain if not exists
    if (!this.domains.has(domain)) {
      await this.addDomain(domain);
    }

    return account;
  }

  async bulkAddAccounts(accounts: { email: string; password: string }[]): Promise<{
    added: number;
    failed: { email: string; reason: string }[];
  }> {
    const results = { added: 0, failed: [] as { email: string; reason: string }[] };

    for (const acc of accounts) {
      try {
        await this.addEmailAccount(acc);
        results.added++;
      } catch (error) {
        results.failed.push({ email: acc.email, reason: (error as Error).message });
      }
    }

    return results;
  }

  // Domain Management
  async addDomain(domain: string): Promise<EmailDomain> {
    const dnsRecords = await this.checkDNSRecords(domain);

    const emailDomain: EmailDomain = {
      id: `dom_${Date.now()}`,
      domain,
      status: dnsRecords.every(r => r.status === 'valid') ? 'active' : 'pending',
      dns_records: dnsRecords,
      health: {
        spf_valid: dnsRecords.find(r => r.type === 'SPF')?.status === 'valid',
        dkim_valid: dnsRecords.find(r => r.type === 'DKIM')?.status === 'valid',
        dmarc_valid: dnsRecords.find(r => r.type === 'DMARC')?.status === 'valid',
        blacklist_status: 'clean',
        blacklists_checked: 50,
        blacklists_listed: [],
        age_days: 0,
        reputation_score: 70
      },
      accounts: [],
      created_at: new Date()
    };

    this.domains.set(domain, emailDomain);
    return emailDomain;
  }

  private async checkDNSRecords(domain: string): Promise<DNSRecord[]> {
    // In production, this would actually check DNS
    return [
      { type: 'SPF', name: '@', value: `v=spf1 include:_spf.${domain} ~all`, status: 'valid', required: true },
      { type: 'DKIM', name: `selector._domainkey`, value: 'v=DKIM1; k=rsa; p=...', status: 'valid', required: true },
      { type: 'DMARC', name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@' + domain, status: 'valid', required: true },
      { type: 'MX', name: '@', value: `mail.${domain}`, status: 'valid', required: true }
    ];
  }

  // Email Warmup
  async startWarmup(account_id: string): Promise<void> {
    const account = this.accounts.get(account_id);
    if (!account) throw new Error('Account not found');

    account.warmup_status.enabled = true;
    account.status = 'warming';
  }

  async pauseWarmup(account_id: string): Promise<void> {
    const account = this.accounts.get(account_id);
    if (!account) throw new Error('Account not found');

    account.warmup_status.enabled = false;
  }

  async processWarmupDay(account_id: string): Promise<{
    emails_sent: number;
    emails_received: number;
    replies_sent: number;
  }> {
    const account = this.accounts.get(account_id);
    if (!account || !account.warmup_status.enabled) {
      return { emails_sent: 0, emails_received: 0, replies_sent: 0 };
    }

    const warmup = account.warmup_status;

    // Warmup network simulation - accounts send/receive emails to each other
    const emailsToSend = warmup.emails_per_day;
    const emailsReceived = Math.floor(emailsToSend * 0.9);
    const repliesToSend = Math.floor(emailsReceived * 0.7);

    // Progress warmup
    warmup.day++;
    warmup.emails_per_day = Math.min(
      warmup.target_emails_per_day,
      Math.floor(warmup.emails_per_day * 1.15)
    );
    warmup.reputation_score = Math.min(100, warmup.reputation_score + 2);
    warmup.inbox_placement_rate = Math.min(98, 70 + warmup.day * 1);
    warmup.reply_rate = 30 + Math.random() * 20;

    // Update account limits based on warmup progress
    account.daily_limit = warmup.emails_per_day;
    account.health_score = warmup.reputation_score;

    if (warmup.day >= warmup.total_days) {
      account.status = 'active';
    }

    return {
      emails_sent: emailsToSend,
      emails_received: emailsReceived,
      replies_sent: repliesToSend
    };
  }

  // Unified Inbox
  async getUnifiedInbox(account_ids?: string[]): Promise<UnifiedInbox> {
    const accounts = account_ids || Array.from(this.accounts.keys());
    const threads = Array.from(this.threads.values())
      .filter(t => accounts.includes(t.account_id));

    return {
      id: 'unified_inbox',
      accounts,
      total_emails: threads.reduce((sum, t) => sum + t.messages.length, 0),
      unread: threads.filter(t => t.messages.some(m => !m.read && m.direction === 'inbound')).length,
      needs_reply: threads.filter(t => {
        const lastMsg = t.messages[t.messages.length - 1];
        return lastMsg && lastMsg.direction === 'inbound' && t.status === 'active';
      }).length,
      starred: threads.filter(t => t.starred).length,
      folders: [
        { id: 'inbox', name: 'Inbox', type: 'inbox', count: threads.length, unread: threads.filter(t => t.messages.some(m => !m.read)).length },
        { id: 'sent', name: 'Sent', type: 'sent', count: threads.filter(t => t.messages.some(m => m.direction === 'outbound')).length, unread: 0 },
        { id: 'drafts', name: 'Drafts', type: 'drafts', count: 0, unread: 0 },
        { id: 'spam', name: 'Spam', type: 'spam', count: 0, unread: 0 }
      ]
    };
  }

  async getThreads(filters?: {
    account_id?: string;
    status?: string;
    sentiment?: string;
    search?: string;
    folder?: string;
  }): Promise<EmailThread[]> {
    let threads = Array.from(this.threads.values());

    if (filters?.account_id) threads = threads.filter(t => t.account_id === filters.account_id);
    if (filters?.status) threads = threads.filter(t => t.status === filters.status);
    if (filters?.sentiment) threads = threads.filter(t => t.sentiment === filters.sentiment);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      threads = threads.filter(t =>
        t.subject.toLowerCase().includes(search) ||
        t.lead_name.toLowerCase().includes(search) ||
        t.lead_email.toLowerCase().includes(search)
      );
    }

    return threads.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
  }

  async generateAIReply(thread_id: string): Promise<string> {
    const thread = this.threads.get(thread_id);
    if (!thread) throw new Error('Thread not found');

    const lastMessage = thread.messages[thread.messages.length - 1];

    // AI would analyze conversation and generate contextual reply
    const templates = {
      interested: `Thanks for your interest! I'd love to schedule a quick call to discuss how we can help ${thread.lead_company || 'your team'}. What does your calendar look like this week?`,
      question: `Great question! [Answer based on context]. Does that help clarify things? Happy to jump on a call if you'd like to discuss further.`,
      objection: `I completely understand your concern. Many of our customers felt the same way initially. [Address specific objection]. Would it help if I shared some specific examples?`,
      neutral: `Thanks for getting back to me! I wanted to follow up on my previous message. Is this something that might be relevant for ${thread.lead_company || 'you'} right now?`
    };

    return templates[thread.sentiment as keyof typeof templates] || templates.neutral;
  }

  async sendReply(thread_id: string, content: string, account_id: string): Promise<EmailMessage> {
    const thread = this.threads.get(thread_id);
    if (!thread) throw new Error('Thread not found');

    const account = this.accounts.get(account_id);
    if (!account) throw new Error('Account not found');

    const message: EmailMessage = {
      id: `msg_${Date.now()}`,
      direction: 'outbound',
      from: account.email,
      to: [thread.lead_email],
      subject: `Re: ${thread.subject}`,
      body_html: content,
      body_text: content.replace(/<[^>]*>/g, ''),
      attachments: [],
      timestamp: new Date(),
      read: true,
      tracking: {
        opened: false,
        open_count: 0,
        clicked: false,
        click_count: 0,
        links_clicked: []
      }
    };

    thread.messages.push(message);
    thread.status = 'replied';
    thread.updated_at = new Date();

    account.sent_today++;
    account.last_activity = new Date();

    return message;
  }

  // Cold Email Campaigns
  async createCampaign(config: {
    name: string;
    accounts: string[];
    leads: Omit<CampaignLead, 'id' | 'status' | 'current_step'>[];
    sequence: Omit<EmailSequence, 'id'>;
    settings?: Partial<CampaignSettings>;
  }): Promise<ColdEmailCampaign> {
    const campaign: ColdEmailCampaign = {
      id: `camp_${Date.now()}`,
      name: config.name,
      status: 'draft',
      accounts: config.accounts,
      leads: config.leads.map((lead, i) => ({
        ...lead,
        id: `lead_${Date.now()}_${i}`,
        status: 'pending',
        current_step: 0
      })),
      sequence: {
        ...config.sequence,
        id: `seq_${Date.now()}`
      },
      settings: {
        daily_limit_per_account: 50,
        send_window: { start: '09:00', end: '17:00' },
        timezone: 'America/New_York',
        skip_weekends: true,
        stop_on_reply: true,
        stop_on_auto_reply: false,
        track_opens: true,
        track_clicks: true,
        unsubscribe_link: true,
        ...config.settings
      },
      stats: {
        total_leads: config.leads.length,
        emails_sent: 0,
        emails_delivered: 0,
        emails_opened: 0,
        emails_clicked: 0,
        emails_replied: 0,
        emails_bounced: 0,
        unsubscribed: 0,
        open_rate: 0,
        click_rate: 0,
        reply_rate: 0,
        bounce_rate: 0
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async startCampaign(campaign_id: string): Promise<void> {
    const campaign = this.campaigns.get(campaign_id);
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'active';
    campaign.leads.forEach(lead => {
      if (lead.status === 'pending') {
        lead.status = 'active';
      }
    });
  }

  async pauseCampaign(campaign_id: string): Promise<void> {
    const campaign = this.campaigns.get(campaign_id);
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'paused';
  }

  // Deliverability
  async getDeliverabilityReport(account_id: string): Promise<DeliverabilityReport> {
    const account = this.accounts.get(account_id);
    if (!account) throw new Error('Account not found');

    return {
      account_id,
      period: 'week',
      inbox_placement: account.warmup_status.inbox_placement_rate,
      spam_placement: account.warmup_status.spam_rate,
      missing: 100 - account.warmup_status.inbox_placement_rate - account.warmup_status.spam_rate,
      provider_breakdown: [
        { provider: 'Gmail', inbox_rate: 92, spam_rate: 5 },
        { provider: 'Outlook', inbox_rate: 88, spam_rate: 8 },
        { provider: 'Yahoo', inbox_rate: 85, spam_rate: 10 },
        { provider: 'Other', inbox_rate: 80, spam_rate: 12 }
      ],
      issues: this.detectDeliverabilityIssues(account),
      recommendations: this.generateRecommendations(account)
    };
  }

  private detectDeliverabilityIssues(account: EmailAccount): DeliverabilityIssue[] {
    const issues: DeliverabilityIssue[] = [];

    if (account.health_score < 70) {
      issues.push({
        type: 'reputation',
        severity: 'high',
        message: 'Account reputation is below optimal levels',
        fix: 'Continue warmup process and maintain high engagement rates'
      });
    }

    if (account.warmup_status.spam_rate > 10) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: 'Spam placement rate is higher than industry average',
        fix: 'Review email content for spam trigger words and improve personalization'
      });
    }

    return issues;
  }

  private generateRecommendations(account: EmailAccount): string[] {
    const recs: string[] = [];

    if (account.status === 'warming') {
      recs.push(`Continue warmup for ${account.warmup_status.total_days - account.warmup_status.day} more days`);
    }

    if (account.warmup_status.reply_rate < 30) {
      recs.push('Improve email content to increase reply rates');
    }

    recs.push('Maintain consistent sending volume');
    recs.push('Keep bounce rate below 2%');

    return recs;
  }

  // Helpers
  private detectProvider(domain: string): EmailAccount['provider'] {
    if (domain.includes('gmail') || domain.includes('google')) return 'google';
    if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('microsoft')) return 'outlook';
    return 'smtp';
  }

  // Getters
  async getAccounts(): Promise<EmailAccount[]> {
    return Array.from(this.accounts.values());
  }

  async getAccount(id: string): Promise<EmailAccount | undefined> {
    return this.accounts.get(id);
  }

  async getDomains(): Promise<EmailDomain[]> {
    return Array.from(this.domains.values());
  }

  async getCampaigns(): Promise<ColdEmailCampaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<ColdEmailCampaign | undefined> {
    return this.campaigns.get(id);
  }

  // Analytics
  async getOverallStats(): Promise<{
    total_accounts: number;
    active_accounts: number;
    warming_accounts: number;
    total_emails_sent: number;
    avg_health_score: number;
    avg_inbox_placement: number;
  }> {
    const accounts = Array.from(this.accounts.values());

    return {
      total_accounts: accounts.length,
      active_accounts: accounts.filter(a => a.status === 'active').length,
      warming_accounts: accounts.filter(a => a.status === 'warming').length,
      total_emails_sent: accounts.reduce((sum, a) => sum + a.sent_today, 0),
      avg_health_score: accounts.length > 0
        ? accounts.reduce((sum, a) => sum + a.health_score, 0) / accounts.length
        : 0,
      avg_inbox_placement: accounts.length > 0
        ? accounts.reduce((sum, a) => sum + a.warmup_status.inbox_placement_rate, 0) / accounts.length
        : 0
    };
  }
}

export const emailInfrastructureService = new EmailInfrastructureService();
