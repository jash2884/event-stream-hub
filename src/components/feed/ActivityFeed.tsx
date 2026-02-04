import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2, ArrowDown } from 'lucide-react';
import { ActivityEvent } from '@/types/events';
import { eventStore } from '@/lib/mockData';
import { FeedItem } from './FeedItem';
import { Button } from '@/components/ui/button';

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [newEvents, setNewEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Initial load
  useEffect(() => {
    const { items, next_cursor } = eventStore.getEvents(20);
    setEvents(items);
    setCursor(next_cursor);
    setLoading(false);
    
    if (isLive) {
      eventStore.startSimulation();
    }
    
    return () => {
      eventStore.stopSimulation();
    };
  }, []);

  // Subscribe to new events
  useEffect(() => {
    if (!isLive) return;
    
    const unsubscribe = eventStore.subscribe((event) => {
      setNewEvents(prev => [event, ...prev]);
    });
    
    return unsubscribe;
  }, [isLive]);

  const loadNewEvents = useCallback(() => {
    setEvents(prev => [...newEvents, ...prev]);
    setNewEvents([]);
  }, [newEvents]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    
    setLoadingMore(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { items, next_cursor } = eventStore.getEvents(20, cursor);
    setEvents(prev => [...prev, ...items]);
    setCursor(next_cursor);
    setLoadingMore(false);
  }, [cursor, loadingMore]);

  const toggleLive = () => {
    if (isLive) {
      eventStore.stopSimulation();
    } else {
      eventStore.startSimulation();
    }
    setIsLive(!isLive);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Activity Feed</h2>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm text-muted-foreground">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>
        
        <Button
          variant={isLive ? 'default' : 'outline'}
          size="sm"
          onClick={toggleLive}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLive ? 'animate-spin' : ''}`} />
          {isLive ? 'Pause' : 'Resume'}
        </Button>
      </div>

      {/* New events banner */}
      <AnimatePresence>
        {newEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button
              onClick={loadNewEvents}
              className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
              {newEvents.length} new {newEvents.length === 1 ? 'event' : 'events'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed items */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <FeedItem
              key={event.event_id}
              event={event}
              index={index}
              isNew={index < newEvents.length}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {cursor && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load more
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
