export type Verb = 'like' | 'comment' | 'follow' | 'purchase' | 'share' | 'mention';

export interface ActivityEvent {
  event_id: string;
  actor_id: string;
  actor_name: string;
  actor_avatar: string;
  verb: Verb;
  object_type: string;
  object_id: string;
  object_title?: string;
  target_user_ids: string[];
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface Notification extends ActivityEvent {
  read: boolean;
  notified_at: string;
}

export interface FeedResponse {
  items: ActivityEvent[];
  next_cursor: string | null;
  total: number;
}

export interface NotificationResponse {
  items: Notification[];
  unread_count: number;
}

export interface TopItem {
  object_id: string;
  object_type: string;
  object_title: string;
  count: number;
  verbs: Record<Verb, number>;
}

export interface AnalyticsResponse {
  window: '1m' | '5m' | '1h';
  items: TopItem[];
  total_events: number;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface SystemMetrics {
  events_per_second: number;
  active_connections: number;
  memory_usage_mb: number;
  cpu_percent: number;
  total_events: number;
  p95_latency_ms: number;
}
