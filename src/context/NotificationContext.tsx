'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '@/lib/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Welcome to Prasad Jeans Club!',
    message: 'Get 10% off on your first order. Use code FIRST50',
    type: 'welcome',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Flash Sale Live!',
    message: '50% off on all Jeans - Limited time only!',
    type: 'offer',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3',
    title: 'New Arrivals',
    message: 'Check out our latest Summer Collection 2024',
    type: 'newArrival',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('pjc_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem('pjc_notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('pjc_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `n-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
