import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmailService, createEmailService, EmailConfig, EmailMessage } from '@/lib/services/email-service';

describe('EmailService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createConfig = (provider: 'sendgrid' | 'mailwizz' | 'smtp'): EmailConfig => ({
    provider,
    apiKey: 'test-api-key',
    fromEmail: 'noreply@test.com',
    fromName: 'Test Sender',
    trackOpens: true,
    trackClicks: true,
  });

  describe('SendGrid Provider', () => {
    it('should send email via SendGrid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'x-message-id': 'msg-123' }),
      });

      const service = createEmailService(createConfig('sendgrid'));
      const message: EmailMessage = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      };

      const result = await service.send(message);

      expect(result.success).toBe(true);
      expect(result.provider).toBe('sendgrid');
      expect(result.messageId).toBe('msg-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      );
    });

    it('should handle SendGrid errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Invalid API Key'),
      });

      const service = createEmailService(createConfig('sendgrid'));
      const result = await service.send({
        to: 'recipient@test.com',
        subject: 'Test',
        text: 'Content',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API Key');
    });

    it('should send to multiple recipients', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
      });

      const service = createEmailService(createConfig('sendgrid'));
      await service.send({
        to: ['user1@test.com', 'user2@test.com'],
        subject: 'Bulk Test',
        text: 'Content',
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.personalizations[0].to).toHaveLength(2);
    });
  });

  describe('Bulk Sending', () => {
    it('should send multiple emails with rate limiting', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers(),
      });

      const service = createEmailService(createConfig('sendgrid'));
      const messages: EmailMessage[] = [
        { to: 'user1@test.com', subject: 'Test 1', text: 'Content 1' },
        { to: 'user2@test.com', subject: 'Test 2', text: 'Content 2' },
      ];

      const results = await service.sendBulk(messages);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Template Sending', () => {
    it('should send using template ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
      });

      const service = createEmailService(createConfig('sendgrid'));
      await service.sendTemplate(
        'user@test.com',
        'template-123',
        { name: 'John', product: 'Test Product' },
        { subject: 'Welcome!' }
      );

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.template_id).toBe('template-123');
      expect(callBody.personalizations[0].dynamic_template_data).toEqual({
        name: 'John',
        product: 'Test Product',
      });
    });
  });

  describe('Email Templates', () => {
    it('should generate new lead notification template', () => {
      const template = EmailService.templates.newLeadNotification({
        domain: 'example.com',
        score: 85,
        assignedTo: 'John Doe',
        dashboardUrl: 'https://app.com/dashboard',
      });

      expect(template.subject).toContain('example.com');
      expect(template.subject).toContain('85');
      expect(template.html).toContain('example.com');
      expect(template.html).toContain('John Doe');
    });

    it('should generate SLA warning template', () => {
      const template = EmailService.templates.slaWarning({
        domain: 'urgent.com',
        minutesRemaining: 10,
        assignedTo: 'Jane Doe',
        dashboardUrl: 'https://app.com/leads/123',
      });

      expect(template.subject).toContain('SLA Warning');
      expect(template.subject).toContain('10min');
      expect(template.html).toContain('immediate attention');
    });
  });
});
