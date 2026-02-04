import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Check, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const apiExamples = {
  ingest: {
    method: 'POST',
    endpoint: '/events',
    description: 'Create a new activity event',
    body: `{
  "actor_id": "user_123",
  "verb": "like",
  "object_type": "post",
  "object_id": "post_456",
  "target_user_ids": ["user_789", "user_012"],
  "created_at": "2024-01-15T10:30:00Z"
}`,
    response: `{
  "event_id": "evt_abc123def"
}`,
  },
  feed: {
    method: 'GET',
    endpoint: '/feed?user_id=user_123&cursor=&limit=20',
    description: 'Retrieve paginated activity feed',
    response: `{
  "items": [
    {
      "event_id": "evt_abc123",
      "actor_id": "user_456",
      "actor_name": "John Doe",
      "verb": "comment",
      "object_type": "post",
      "object_id": "post_789",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "next_cursor": "cursor_xyz789",
  "total": 1523
}`,
  },
  stream: {
    method: 'GET',
    endpoint: '/notifications/stream?user_id=user_123',
    description: 'Real-time notifications via SSE',
    response: `event: notification
data: {"event_id":"evt_123","verb":"follow"...}

event: notification
data: {"event_id":"evt_124","verb":"like"...}

event: heartbeat
data: {"timestamp":"2024-01-15T10:30:05Z"}`,
  },
  top: {
    method: 'GET',
    endpoint: '/top?window=5m',
    description: 'Top 100 most active objects',
    response: `{
  "window": "5m",
  "items": [
    {
      "object_id": "post_123",
      "object_type": "post",
      "count": 1547,
      "verbs": {
        "like": 892,
        "comment": 421,
        "share": 234
      }
    }
  ],
  "total_events": 28456,
  "timestamp": "2024-01-15T10:30:00Z"
}`,
  },
};

export function ApiPlayground() {
  const [activeTab, setActiveTab] = useState('ingest');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          API Playground
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="ingest">Ingest</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="top">Top 100</TabsTrigger>
          </TabsList>

          {Object.entries(apiExamples).map(([key, api]) => (
            <TabsContent key={key} value={key} className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  api.method === 'POST' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                }`}>
                  {api.method}
                </span>
                <code className="text-sm font-mono text-foreground">{api.endpoint}</code>
              </div>
              
              <p className="text-sm text-muted-foreground">{api.description}</p>

              {'body' in api && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Request Body</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(api.body, `${key}-body`)}
                      className="h-7 gap-1"
                    >
                      {copied === `${key}-body` ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto">
                    {api.body}
                  </pre>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Response</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(api.response, `${key}-response`)}
                    className="h-7 gap-1"
                  >
                    {copied === `${key}-response` ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto max-h-64">
                  {api.response}
                </pre>
              </div>

              <Button className="w-full gap-2" variant="outline">
                <Play className="h-4 w-4" />
                Try it
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
