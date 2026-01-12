import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// POST /api/webhooks - Create new webhook integration
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return unauthorizedResponse();

    if (!hasPermission(currentUser.role, 'settings', 'create')) {
      return forbiddenResponse();
    }

    const requestBody = await request.json();
    const { url, events, name, isActive = true } = requestBody;

    if (!url || !events || events.length === 0) {
      return errorResponse('Webhook URL and event types are required');
    }

    const newWebhook = await query(
      `INSERT INTO webhooks (url, events, name, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [url, JSON.stringify(events), name, isActive, currentUser.userId]
    );

    return successResponse(newWebhook[0], 'Webhook created successfully', 201);
  } catch (error: any) {
    console.error('Create webhook error:', error);
    return errorResponse(error.message || 'Failed to create webhook', 500);
  }
}

// GET /api/webhooks - List all webhooks for current user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return unauthorizedResponse();

    const userWebhooks = await query(
      `SELECT id, url, events, name, is_active, created_at, last_triggered,
              total_triggers, total_successes, total_failures
       FROM webhooks
       WHERE created_by = $1
       ORDER BY created_at DESC`,
      [currentUser.userId]
    );

    return successResponse({ webhooks: userWebhooks });
  } catch (error: any) {
    console.error('Get webhooks error:', error);
    return errorResponse(error.message || 'Failed to get webhooks', 500);
  }
}

// Trigger webhook (internal function)
export async function triggerWebhook(event: string, data: any) {
  try {
    const webhooks = await query(
      `SELECT id, url, events
       FROM webhooks
       WHERE is_active = true
       AND $1 = ANY(events::text[])`,
      [event]
    );

    const results = await Promise.allSettled(
      webhooks.map(async (webhook: any) => {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': event,
          },
          body: JSON.stringify({
            event,
            data,
            timestamp: new Date().toISOString(),
          }),
        });

        // Update last_triggered
        await query(
          'UPDATE webhooks SET last_triggered = CURRENT_TIMESTAMP WHERE id = $1',
          [webhook.id]
        );

        return { webhookId: webhook.id, status: response.status };
      })
    );

    return results;
  } catch (error) {
    console.error('Trigger webhook error:', error);
    return [];
  }
}
