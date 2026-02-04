import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Wifi } from 'lucide-react';
import { Notification } from '@/types/events';
import { generateNotification } from '@/lib/mockData';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initialize with some notifications
    setNotifications(Array.from({ length: 8 }, () => generateNotification()));
  }, []);

  // Simulate SSE connection
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = generateNotification({ 
          read: false,
          created_at: new Date().toISOString(),
        });
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Connection status */}
                <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1">
                  <Wifi className={`h-3 w-3 ${isConnected ? 'text-success' : 'text-destructive'}`} />
                  <span className="text-xs font-medium">
                    {isConnected ? 'SSE Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className="border-b border-border p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="w-full gap-2 text-muted-foreground"
                >
                  <Check className="h-4 w-4" />
                  Mark all as read
                </Button>
              </div>
            )}

            {/* Notifications list */}
            <ScrollArea className="h-[calc(100vh-130px)]">
              <div className="p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 opacity-20 mb-3" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.event_id}
                      notification={notification}
                      index={index}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
