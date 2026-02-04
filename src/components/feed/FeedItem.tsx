import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ActivityEvent } from '@/types/events';
import { VerbBadge } from './VerbBadge';
import { cn } from '@/lib/utils';

interface FeedItemProps {
  event: ActivityEvent;
  index?: number;
  isNew?: boolean;
}

export function FeedItem({ event, index = 0, isNew = false }: FeedItemProps) {
  const timeAgo = formatDistanceToNow(new Date(event.created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'feed-item rounded-lg p-4',
        isNew && 'ring-1 ring-primary/50'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative shrink-0"
        >
          <img
            src={event.actor_avatar}
            alt={event.actor_name}
            className="h-10 w-10 rounded-full bg-muted"
          />
          {isNew && (
            <motion.div
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground truncate">
              {event.actor_name}
            </span>
            <VerbBadge verb={event.verb} />
            <span className="text-muted-foreground">
              {event.object_type}
            </span>
          </div>
          
          {event.object_title && (
            <p className="mt-1 text-sm text-foreground/80 truncate">
              "{event.object_title}"
            </p>
          )}
          
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{timeAgo}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="font-mono text-[10px] opacity-60">{event.event_id}</span>
          </div>
        </div>

        {/* Object type indicator */}
        <div className="shrink-0 px-2 py-1 rounded bg-secondary text-xs font-mono text-muted-foreground">
          {event.object_type}
        </div>
      </div>
    </motion.div>
  );
}
