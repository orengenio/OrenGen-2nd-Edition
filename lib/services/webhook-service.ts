/**
 * Webhook Events Service
 * Send real-time notifications to external systems on CRM/Lead events
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
export type WebhookEventType =
  | 'lead.created'
  | 'lead.enriched'
  | 'lead.qualified'
  | 'lead.assigned'
  | 'lead.converted'
  | 'lead.status_changed'
  | 'contact.created'
  | 'contact.updated'
  | 'company.created'
  | 'company.updated'
  | 'deal.created'
  | 'deal.stage_changed'
  | 'deal.won'
  | 'deal.lost'
  | 'activity.created'
  | 'referral.created'
  | 'referral.converted'
  | 'sla.warning'
  | 'sla.breach';

export interface WebhookEndpoint {
  id: string;
  tenant_id: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  headers?: Record<string, string>;
  enabled: boolean;
  retry_count: number;
  retry_delay_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  endpoint_id: string;
  event_type: WebhookEventType;
  payload: any;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  last_attempt_at?: string;
  response_status?: number;
  response_body?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface WebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  tenant_id: string;
  data: any;
}

export class WebhookService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  // ==================== ENDPOINT MANAGEMENT ====================

  async createEndpoint(endpoint: {
    name: string;
    url: string;
    events: WebhookEventType[];
    headers?: Record<string, string>;
    enabled?: boolean;
  }): Promise<WebhookEndpoint> {
    const secret = this.generateSecret();

    const { data, error } = await supabase
      .from('webhook_endpoints')
      .insert({
        tenant_id: this.tenantId,
        name: endpoint.name,
        url: endpoint.url,
        secret,
        events: endpoint.events,
        headers: endpoint.headers || {},
        enabled: endpoint.enabled ?? true,
        retry_count: 3,
        retry_delay_seconds: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create webhook: ${error.message}`);
    return data;
  }

  async updateEndpoint(id: string, updates: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> {
    const { data, error } = await supabase
      .from('webhook_endpoints')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('tenant_id', this.tenantId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update webhook: ${error.message}`);
    return data;
  }

  async deleteEndpoint(id: string): Promise<void> {
    const { error } = await supabase
      .from('webhook_endpoints')
      .delete()
      .eq('id', id)
      .eq('tenant_id', this.tenantId);

    if (error) throw new Error(`Failed to delete webhook: ${error.message}`);
  }

  async getEndpoints(): Promise<WebhookEndpoint[]> {
    const { data } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  async getEndpoint(id: string): Promise<WebhookEndpoint | null> {
    const { data } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', this.tenantId)
      .single();

    return data;
  }

  // Regenerate secret
  async regenerateSecret(id: string): Promise<string> {
    const newSecret = this.generateSecret();

    await supabase
      .from('webhook_endpoints')
      .update({ secret: newSecret, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', this.tenantId);

    return newSecret;
  }

  // ==================== EVENT DISPATCHING ====================

  // Dispatch event to all matching webhooks
  async dispatch(event: WebhookEventType, data: any): Promise<void> {
    // Get all enabled endpoints subscribed to this event
    const { data: endpoints } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .eq('enabled', true)
      .contains('events', [event]);

    if (!endpoints || endpoints.length === 0) return;

    // Create delivery records and send
    for (const endpoint of endpoints) {
      await this.sendWebhook(endpoint, event, data);
    }
  }

  // Send webhook to single endpoint
  private async sendWebhook(
    endpoint: WebhookEndpoint,
    event: WebhookEventType,
    data: any
  ): Promise<void> {
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      tenant_id: this.tenantId,
      data,
    };

    // Create delivery record
    const { data: delivery, error } = await supabase
      .from('webhook_deliveries')
      .insert({
        endpoint_id: endpoint.id,
        event_type: event,
        payload,
        status: 'pending',
        attempts: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !delivery) return;

    // Attempt delivery
    await this.attemptDelivery(delivery.id, endpoint, payload);
  }

  // Attempt to deliver webhook
  private async attemptDelivery(
    deliveryId: string,
    endpoint: WebhookEndpoint,
    payload: WebhookPayload
  ): Promise<boolean> {
    const signature = this.signPayload(JSON.stringify(payload), endpoint.secret);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Webhook-Event': payload.event,
      'X-Webhook-Delivery-Id': deliveryId,
      'X-Webhook-Timestamp': payload.timestamp,
      ...endpoint.headers,
    };

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      const responseBody = await response.text();

      if (response.ok) {
        // Success
        await supabase
          .from('webhook_deliveries')
          .update({
            status: 'success',
            attempts: supabase.sql`attempts + 1`,
            last_attempt_at: new Date().toISOString(),
            response_status: response.status,
            response_body: responseBody.slice(0, 1000),
            completed_at: new Date().toISOString(),
          })
          .eq('id', deliveryId);

        return true;
      } else {
        // HTTP error
        await this.handleFailure(deliveryId, endpoint, {
          responseStatus: response.status,
          responseBody: responseBody.slice(0, 1000),
          error: `HTTP ${response.status}`,
        });
        return false;
      }
    } catch (error: any) {
      // Network or timeout error
      await this.handleFailure(deliveryId, endpoint, {
        error: error.message,
      });
      return false;
    }
  }

  // Handle delivery failure
  private async handleFailure(
    deliveryId: string,
    endpoint: WebhookEndpoint,
    details: {
      responseStatus?: number;
      responseBody?: string;
      error: string;
    }
  ): Promise<void> {
    // Get current delivery
    const { data: delivery } = await supabase
      .from('webhook_deliveries')
      .select('*')
      .eq('id', deliveryId)
      .single();

    if (!delivery) return;

    const newAttempts = delivery.attempts + 1;
    const shouldRetry = newAttempts < endpoint.retry_count;

    await supabase
      .from('webhook_deliveries')
      .update({
        status: shouldRetry ? 'retrying' : 'failed',
        attempts: newAttempts,
        last_attempt_at: new Date().toISOString(),
        response_status: details.responseStatus,
        response_body: details.responseBody,
        error: details.error,
        ...(shouldRetry ? {} : { completed_at: new Date().toISOString() }),
      })
      .eq('id', deliveryId);

    // Schedule retry
    if (shouldRetry) {
      const retryDelay = endpoint.retry_delay_seconds * Math.pow(2, newAttempts - 1); // Exponential backoff
      await supabase.from('scheduled_jobs').insert({
        type: 'webhook_retry',
        payload: { delivery_id: deliveryId, endpoint_id: endpoint.id },
        run_at: new Date(Date.now() + retryDelay * 1000).toISOString(),
        status: 'pending',
      });
    }
  }

  // ==================== DELIVERY HISTORY ====================

  async getDeliveries(options?: {
    endpointId?: string;
    status?: WebhookDelivery['status'];
    eventType?: WebhookEventType;
    page?: number;
    limit?: number;
  }): Promise<{ deliveries: WebhookDelivery[]; total: number }> {
    let query = supabase
      .from('webhook_deliveries')
      .select('*, endpoint:webhook_endpoints!inner(*)', { count: 'exact' })
      .eq('endpoint.tenant_id', this.tenantId)
      .order('created_at', { ascending: false });

    if (options?.endpointId) query = query.eq('endpoint_id', options.endpointId);
    if (options?.status) query = query.eq('status', options.status);
    if (options?.eventType) query = query.eq('event_type', options.eventType);

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;

    if (error) throw new Error(`Failed to get deliveries: ${error.message}`);

    return {
      deliveries: data || [],
      total: count || 0,
    };
  }

  // Retry failed delivery
  async retryDelivery(deliveryId: string): Promise<boolean> {
    const { data: delivery } = await supabase
      .from('webhook_deliveries')
      .select('*, endpoint:webhook_endpoints(*)')
      .eq('id', deliveryId)
      .single();

    if (!delivery || !delivery.endpoint) return false;

    return this.attemptDelivery(deliveryId, delivery.endpoint, delivery.payload);
  }

  // ==================== TESTING ====================

  async testEndpoint(id: string): Promise<{
    success: boolean;
    responseStatus?: number;
    responseTime?: number;
    error?: string;
  }> {
    const endpoint = await this.getEndpoint(id);
    if (!endpoint) throw new Error('Endpoint not found');

    const testPayload: WebhookPayload = {
      id: crypto.randomUUID(),
      event: 'lead.created',
      timestamp: new Date().toISOString(),
      tenant_id: this.tenantId,
      data: {
        test: true,
        message: 'This is a test webhook delivery',
      },
    };

    const signature = this.signPayload(JSON.stringify(testPayload), endpoint.secret);
    const startTime = Date.now();

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': 'test',
          'X-Webhook-Test': 'true',
          ...endpoint.headers,
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(10000),
      });

      const responseTime = Date.now() - startTime;

      return {
        success: response.ok,
        responseStatus: response.status,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error: any) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  // ==================== HELPERS ====================

  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private signPayload(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  // Verify incoming webhook signature (for receiving webhooks)
  static verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}

// Factory
export function createWebhookService(tenantId: string): WebhookService {
  return new WebhookService(tenantId);
}

// Convenience function for dispatching events
export async function dispatchWebhookEvent(
  tenantId: string,
  event: WebhookEventType,
  data: any
): Promise<void> {
  const service = new WebhookService(tenantId);
  await service.dispatch(event, data);
}
