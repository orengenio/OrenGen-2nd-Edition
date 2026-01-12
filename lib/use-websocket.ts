'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from './api-client';

export interface Notification {
  id: string;
  type: 'new_lead' | 'lead_assigned' | 'lead_status_changed' | 'high_value_lead';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) return;

    // Connect to WebSocket server
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('notification', (notification: any) => {
      // Format notification
      const formattedNotification: Notification = {
        id: notification.id || crypto.randomUUID(),
        type: notification.type,
        title: getNotificationTitle(notification),
        message: getNotificationMessage(notification),
        data: notification.lead || notification.data,
        timestamp: notification.timestamp,
        read: false,
      };

      setNotifications((prev) => [formattedNotification, ...prev]);

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(formattedNotification.title, {
          body: formattedNotification.message,
          icon: '/logo.png',
          tag: formattedNotification.id,
        });
      }

      // Play notification sound
      playNotificationSound(notification.type);
    });

    setSocket(newSocket);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    socket,
    isConnected,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };
}

function getNotificationTitle(notification: any): string {
  switch (notification.type) {
    case 'new_lead':
      return '🔥 New Lead';
    case 'lead_assigned':
      return '📋 Lead Assigned';
    case 'lead_status_changed':
      return '🔄 Lead Status Changed';
    case 'high_value_lead':
      return '⚡ High-Value Lead!';
    default:
      return 'Notification';
  }
}

function getNotificationMessage(notification: any): string {
  switch (notification.type) {
    case 'new_lead':
      return `New lead: ${notification.lead?.domain || 'Unknown'}`;
    case 'lead_assigned':
      return `Lead ${notification.lead?.domain || ''} assigned to you`;
    case 'lead_status_changed':
      return `Lead ${notification.lead?.domain || ''} status: ${notification.newStatus}`;
    case 'high_value_lead':
      return `High-value lead (score: ${notification.lead?.lead_score || 0}): ${notification.lead?.domain || ''}`;
    default:
      return notification.message || '';
  }
}

function playNotificationSound(type: string) {
  try {
    const audio = new Audio(
      type === 'high_value_lead' ? '/sounds/high-priority.mp3' : '/sounds/notification.mp3'
    );
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore errors (user might not have interacted with page yet)
    });
  } catch (e) {
    // Ignore sound errors
  }
}
