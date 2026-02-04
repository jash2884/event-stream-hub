import { ActivityEvent, Notification, TopItem, User, Verb, SystemMetrics } from '@/types/events';

const verbs: Verb[] = ['like', 'comment', 'follow', 'purchase', 'share', 'mention'];
const objectTypes = ['post', 'article', 'product', 'repository', 'profile', 'comment'];

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Reese', 'Drew'];
const lastNames = ['Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];

const objectTitles: Record<string, string[]> = {
  post: ['Building scalable systems', 'React performance tips', 'Database optimization guide', 'API design patterns', 'Microservices at scale'],
  article: ['The future of AI', 'Web3 explained', 'DevOps best practices', 'Security fundamentals', 'Cloud architecture'],
  product: ['Pro Subscription', 'Enterprise License', 'Team Plan', 'Starter Kit', 'Developer Tools'],
  repository: ['activity-feed-system', 'notification-service', 'analytics-engine', 'event-processor', 'stream-handler'],
  profile: ['Developer profile', 'Team page', 'Company profile', 'Portfolio', 'Public page'],
  comment: ['Great insight!', 'This helped me a lot', 'Interesting approach', 'Thanks for sharing', 'Well explained'],
};

export const generateUser = (id?: string): User => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return {
    id: id || `user_${Math.random().toString(36).substring(2, 9)}`,
    name: `${firstName} ${lastName}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  };
};

export const generateEvent = (overrides?: Partial<ActivityEvent>): ActivityEvent => {
  const actor = generateUser();
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
  const titles = objectTitles[objectType];
  const objectTitle = titles[Math.floor(Math.random() * titles.length)];
  
  const createdAt = new Date(Date.now() - Math.random() * 3600000);
  
  return {
    event_id: `evt_${Math.random().toString(36).substring(2, 11)}`,
    actor_id: actor.id,
    actor_name: actor.name,
    actor_avatar: actor.avatar,
    verb,
    object_type: objectType,
    object_id: `${objectType}_${Math.random().toString(36).substring(2, 9)}`,
    object_title: objectTitle,
    target_user_ids: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => generateUser().id),
    created_at: createdAt.toISOString(),
    ...overrides,
  };
};

export const generateNotification = (overrides?: Partial<Notification>): Notification => {
  const event = generateEvent();
  return {
    ...event,
    read: Math.random() > 0.6,
    notified_at: new Date().toISOString(),
    ...overrides,
  };
};

export const generateTopItems = (count: number = 100): TopItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const titles = objectTitles[objectType];
    const baseCount = Math.floor(1000 / (i + 1)) + Math.floor(Math.random() * 50);
    
    const verbCounts: Record<Verb, number> = {
      like: Math.floor(baseCount * 0.4),
      comment: Math.floor(baseCount * 0.2),
      follow: Math.floor(baseCount * 0.15),
      purchase: Math.floor(baseCount * 0.1),
      share: Math.floor(baseCount * 0.1),
      mention: Math.floor(baseCount * 0.05),
    };
    
    return {
      object_id: `${objectType}_${Math.random().toString(36).substring(2, 9)}`,
      object_type: objectType,
      object_title: titles[Math.floor(Math.random() * titles.length)],
      count: baseCount,
      verbs: verbCounts,
    };
  }).sort((a, b) => b.count - a.count);
};

export const generateFeed = (count: number = 20, cursor?: string): { items: ActivityEvent[]; next_cursor: string | null } => {
  const items = Array.from({ length: count }, () => generateEvent());
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return {
    items,
    next_cursor: `cursor_${Math.random().toString(36).substring(2, 9)}`,
  };
};

export const generateMetrics = (): SystemMetrics => ({
  events_per_second: Math.floor(Math.random() * 500) + 100,
  active_connections: Math.floor(Math.random() * 1500) + 500,
  memory_usage_mb: Math.floor(Math.random() * 512) + 256,
  cpu_percent: Math.floor(Math.random() * 40) + 10,
  total_events: Math.floor(Math.random() * 50000000) + 150000000,
  p95_latency_ms: Math.floor(Math.random() * 20) + 5,
});

// Simulated event store for the demo
class EventStore {
  private events: ActivityEvent[] = [];
  private listeners: ((event: ActivityEvent) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Pre-populate with some events
    this.events = Array.from({ length: 50 }, () => generateEvent());
    this.events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  startSimulation() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      const event = generateEvent({ created_at: new Date().toISOString() });
      this.addEvent(event);
    }, 2000 + Math.random() * 3000);
  }

  stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addEvent(event: ActivityEvent) {
    this.events.unshift(event);
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }
    this.listeners.forEach(listener => listener(event));
  }

  getEvents(limit: number = 20, cursor?: string): { items: ActivityEvent[]; next_cursor: string | null } {
    const startIndex = cursor ? this.events.findIndex(e => e.event_id === cursor) + 1 : 0;
    const items = this.events.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < this.events.length;
    
    return {
      items,
      next_cursor: hasMore ? items[items.length - 1]?.event_id : null,
    };
  }

  subscribe(listener: (event: ActivityEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getTotalCount() {
    return this.events.length;
  }
}

export const eventStore = new EventStore();
