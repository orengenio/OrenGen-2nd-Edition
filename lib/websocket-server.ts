import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from './auth';

let io: SocketIOServer | null = null;

export function initializeWebSocket(socketServer: SocketIOServer) {
  io = socketServer;

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return next(new Error('Authentication error'));
    }

    socket.data.user = payload;
    next();
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;

    console.log(`User connected: ${user.email} (${user.userId})`);

    // Join user-specific room
    socket.join(`user:${user.userId}`);

    // Join role-specific room
    socket.join(`role:${user.role}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.email}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

// Emit new lead notification
export function notifyNewLead(lead: any, assignedToUserId?: string) {
  if (!io) return;

  const notification = {
    type: 'new_lead',
    lead,
    timestamp: new Date().toISOString(),
  };

  if (assignedToUserId) {
    // Notify specific user
    io.to(`user:${assignedToUserId}`).emit('notification', notification);
  } else {
    // Notify all sales reps and managers
    io.to('role:sales_rep').emit('notification', notification);
    io.to('role:sales_manager').emit('notification', notification);
  }
}

// Emit lead assignment notification
export function notifyLeadAssignment(lead: any, userId: string, assignedBy: string) {
  if (!io) return;

  io.to(`user:${userId}`).emit('notification', {
    type: 'lead_assigned',
    lead,
    assignedBy,
    timestamp: new Date().toISOString(),
  });
}

// Emit lead status change
export function notifyLeadStatusChange(lead: any, oldStatus: string, newStatus: string) {
  if (!io) return;

  if (lead.assigned_to) {
    io.to(`user:${lead.assigned_to}`).emit('notification', {
      type: 'lead_status_changed',
      lead,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    });
  }
}

// Emit high-value lead alert
export function notifyHighValueLead(lead: any, assignedToUserId?: string) {
  if (!io) return;

  const notification = {
    type: 'high_value_lead',
    lead,
    priority: 'high',
    timestamp: new Date().toISOString(),
  };

  // Notify the assigned user if specified
  if (assignedToUserId) {
    io.to(`user:${assignedToUserId}`).emit('notification', notification);
  }

  // Also notify all sales managers
  io.to('role:sales_manager').emit('notification', notification);
}
