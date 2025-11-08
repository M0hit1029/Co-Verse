import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_updated' | 'task_moved';
  title: string;
  message: string;
  taskId?: string;
  projectId: string;
  timestamp: number;
  read: boolean;
  displayed: boolean; // Whether toast has been shown
}

interface NotificationStore {
  notifications: Notification[];
  onlineUsers: Set<string>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'displayed'>) => void;
  markAsRead: (notificationId: string) => void;
  markAsDisplayed: (notificationId: string) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  isUserOnline: (userId: string) => boolean;
  getUnreadNotifications: (userId: string) => Notification[];
  getUndisplayedNotifications: (userId: string) => Notification[];
  getAllNotifications: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      onlineUsers: new Set<string>(),

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification-${crypto.randomUUID()}`,
          timestamp: Date.now(),
          read: false,
          displayed: false,
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
      },

      markAsRead: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      markAsDisplayed: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, displayed: true } : n
          ),
        })),

      setUserOnline: (userId: string) => {
        const state = get();
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.add(userId);
        set({ onlineUsers: newOnlineUsers });
      },

      setUserOffline: (userId: string) => {
        const state = get();
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        set({ onlineUsers: newOnlineUsers });
      },

      isUserOnline: (userId: string) => {
        const state = get();
        return state.onlineUsers.has(userId);
      },

      getUnreadNotifications: (userId: string) => {
        const state = get();
        return state.notifications
          .filter((n) => n.userId === userId && !n.read)
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      getUndisplayedNotifications: (userId: string) => {
        const state = get();
        return state.notifications
          .filter((n) => n.userId === userId && !n.displayed)
          .sort((a, b) => a.timestamp - b.timestamp); // oldest first for display queue
      },

      getAllNotifications: (userId: string) => {
        const state = get();
        return state.notifications
          .filter((n) => n.userId === userId)
          .sort((a, b) => b.timestamp - a.timestamp);
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
        // Don't persist onlineUsers - they should be reset on refresh
      }),
    }
  )
);
