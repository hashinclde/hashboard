import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove after 5 seconds for success/info notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id && !n.read) {
        setUnreadCount(count => Math.max(0, count - 1));
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Listen for global notification events
  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { type, message, title } = event.detail;
      addNotification({
        type: type || 'info',
        title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'),
        message
      });
    };

    window.addEventListener('show-notification', handleNotification as EventListener);
    
    return () => {
      window.removeEventListener('show-notification', handleNotification as EventListener);
    };
  }, []);

  // Send initial notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'Welcome to hashboard!',
        message: 'Your AI-powered project management dashboard is ready to use.'
      });

      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'System Status',
          message: 'All AI agents are online and monitoring your project.'
        });
      }, 2000);

      setTimeout(() => {
        addNotification({
          type: 'warning',
          title: 'Tutorial Available',
          message: 'Click the tutorial button to get started with hashboard features.'
        });
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead
  };
}