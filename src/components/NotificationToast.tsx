'use client';

import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { X } from 'lucide-react';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
}

export function NotificationToast() {
  const { currentUser } = useUserStore();
  const { getUndisplayedNotifications, markAsDisplayed, setUserOnline } = useNotificationStore();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    // Mark user as online when component mounts
    setUserOnline(currentUser.id);

    // Check for undisplayed notifications every 2 seconds
    const interval = setInterval(() => {
      const undisplayed = getUndisplayedNotifications(currentUser.id);
      
      if (undisplayed.length > 0) {
        // Show the first undisplayed notification
        const notification = undisplayed[0];
        
        // Add to toast display
        setToasts((prev) => [
          ...prev,
          {
            id: notification.id,
            title: notification.title,
            message: notification.message,
          },
        ]);

        // Mark as displayed
        markAsDisplayed(notification.id);

        // Auto-remove after 5 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== notification.id));
        }, 5000);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [currentUser.id, getUndisplayedNotifications, markAsDisplayed, setUserOnline]);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-black border-2 border-[#00ff00] rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] animate-slide-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-[#00ff00] mb-1">{toast.title}</h4>
              <p className="text-sm text-[#00ff00]/80">{toast.message}</p>
            </div>
            <button
              onClick={() => handleDismiss(toast.id)}
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
