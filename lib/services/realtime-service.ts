/**
 * Real-time WebSocket Service
 * Provides live updates for CRM activities, notifications, and collaboration
 */

// Types
export interface WebSocketMessage {
  type: MessageType;
  payload: any;
  timestamp: string;
  userId?: string;
  tenantId?: string;
}

export type MessageType =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.assigned'
  | 'contact.created'
  | 'contact.updated'
  | 'deal.created'
  | 'deal.updated'
  | 'deal.stage_changed'
  | 'deal.won'
  | 'deal.lost'
  | 'activity.created'
  | 'task.assigned'
  | 'task.completed'
  | 'notification'
  | 'user.online'
  | 'user.offline'
  | 'typing'
  | 'presence'
  | 'sync';

export interface PresenceInfo {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentPage?: string;
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  read: boolean;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;

// WebSocket Client
export class RealtimeClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private tenantId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<MessageType | '*', Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private pendingMessages: WebSocketMessage[] = [];
  private isConnected = false;

  constructor(url: string, token: string, tenantId: string) {
    this.url = url;
    this.token = token;
    this.tenantId = tenantId;
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.url}?token=${this.token}&tenant=${this.tenantId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushPendingMessages();
          this.connectionHandlers.forEach(handler => handler());
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.disconnectionHandlers.forEach(handler => handler());

          // Attempt reconnection
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
  }

  // Send message to server
  send(type: MessageType, payload: any): void {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later
      this.pendingMessages.push(message);
    }
  }

  // Subscribe to specific message type
  on(type: MessageType | '*', handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  // Subscribe to connection events
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  // Subscribe to disconnection events
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.add(handler);
    return () => this.disconnectionHandlers.delete(handler);
  }

  // Get connection status
  getStatus(): boolean {
    return this.isConnected;
  }

  // Handle incoming message
  private handleMessage(message: WebSocketMessage): void {
    // Call specific handlers
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    // Call wildcard handlers
    const wildcardHandlers = this.messageHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(message));
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('presence' as MessageType, { status: 'online' });
      }
    }, 30000); // Every 30 seconds
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`[WebSocket] Reconnecting in ${delay}ms...`);

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(() => {
        // Will trigger another reconnect via onclose
      });
    }, delay);
  }

  // Flush pending messages after reconnection
  private flushPendingMessages(): void {
    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift()!;
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }
}

// React Hook for WebSocket
export function useRealtime(url: string, token: string, tenantId: string) {
  const clientRef = { current: null as RealtimeClient | null };

  const connect = () => {
    if (!clientRef.current) {
      clientRef.current = new RealtimeClient(url, token, tenantId);
    }
    return clientRef.current.connect();
  };

  const disconnect = () => {
    clientRef.current?.disconnect();
  };

  const subscribe = (type: MessageType | '*', handler: MessageHandler) => {
    return clientRef.current?.on(type, handler) || (() => {});
  };

  const send = (type: MessageType, payload: any) => {
    clientRef.current?.send(type, payload);
  };

  return { connect, disconnect, subscribe, send, client: clientRef };
}

// Server-side WebSocket handler (for API route)
export interface WebSocketServer {
  broadcast: (tenantId: string, message: WebSocketMessage) => void;
  sendToUser: (userId: string, message: WebSocketMessage) => void;
  getOnlineUsers: (tenantId: string) => PresenceInfo[];
}

// Notification helper
export function createNotification(
  title: string,
  message: string,
  type: NotificationPayload['type'] = 'info',
  actionUrl?: string
): WebSocketMessage {
  return {
    type: 'notification',
    payload: {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      actionUrl,
      read: false,
    } as NotificationPayload,
    timestamp: new Date().toISOString(),
  };
}

// Event creators for common actions
export const realtimeEvents = {
  leadCreated: (lead: any): WebSocketMessage => ({
    type: 'lead.created',
    payload: lead,
    timestamp: new Date().toISOString(),
  }),

  leadUpdated: (lead: any): WebSocketMessage => ({
    type: 'lead.updated',
    payload: lead,
    timestamp: new Date().toISOString(),
  }),

  leadAssigned: (leadId: string, assigneeId: string, assigneeName: string): WebSocketMessage => ({
    type: 'lead.assigned',
    payload: { leadId, assigneeId, assigneeName },
    timestamp: new Date().toISOString(),
  }),

  dealCreated: (deal: any): WebSocketMessage => ({
    type: 'deal.created',
    payload: deal,
    timestamp: new Date().toISOString(),
  }),

  dealStageChanged: (dealId: string, fromStage: string, toStage: string, dealName: string): WebSocketMessage => ({
    type: 'deal.stage_changed',
    payload: { dealId, fromStage, toStage, dealName },
    timestamp: new Date().toISOString(),
  }),

  dealWon: (deal: any): WebSocketMessage => ({
    type: 'deal.won',
    payload: deal,
    timestamp: new Date().toISOString(),
  }),

  taskAssigned: (task: any, assigneeId: string): WebSocketMessage => ({
    type: 'task.assigned',
    payload: { task, assigneeId },
    timestamp: new Date().toISOString(),
  }),

  taskCompleted: (task: any): WebSocketMessage => ({
    type: 'task.completed',
    payload: task,
    timestamp: new Date().toISOString(),
  }),

  userTyping: (userId: string, context: string): WebSocketMessage => ({
    type: 'typing',
    payload: { userId, context },
    timestamp: new Date().toISOString(),
  }),
};

// Factory function
export function createRealtimeClient(
  url: string,
  token: string,
  tenantId: string
): RealtimeClient {
  return new RealtimeClient(url, token, tenantId);
}
