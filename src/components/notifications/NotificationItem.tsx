import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/events';
import { VerbBadge } from '../feed/VerbBadge';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  index?: number;
}

export function NotificationItem({ notification, index = 0 }: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        notification.read 
          ? 'hover:bg-muted/50' 
          : 'notification-unread hover:bg-primary/15'
      )}
    >
      <img
        src={notification.actor_avatar}
        alt={notification.actor_name}
        className="h-8 w-8 rounded-full bg-muted shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{notification.actor_name}</span>
          <VerbBadge verb={notification.verb} showIcon={false} className="text-[10px]" />
        </div>
        
        {notification.object_title && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {notification.object_title}
          </p>
        )}
        
        <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
          {timeAgo}
        </span>
      </div>

      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </motion.div>
  );
}
