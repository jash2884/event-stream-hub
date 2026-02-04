import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Server, 
  Zap, 
  Shield, 
  GitBranch, 
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const sections = [
  {
    id: 'architecture',
    title: 'System Architecture',
    icon: Server,
  },
  {
    id: 'data-model',
    title: 'Data Model & Indexing',
    icon: Database,
  },
  {
    id: 'fanout',
    title: 'Fanout Strategy',
    icon: GitBranch,
  },
  {
    id: 'caching',
    title: 'Caching Strategy',
    icon: Zap,
  },
  {
    id: 'delivery',
    title: 'Delivery Guarantees',
    icon: Shield,
  },
  {
    id: 'scaling',
    title: 'Scaling Plan',
    icon: Layers,
  },
];

const DesignDoc = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-primary border-primary">
            System Design Document
          </Badge>
          <h1 className="text-4xl font-bold gradient-text">
            Activity Feed + Notifications System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A scalable, real-time activity feed and notification system supporting 
            2,000+ concurrent connections and 200M+ stored events.
          </p>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm"
            >
              <section.icon className="h-3.5 w-3.5" />
              {section.title}
            </a>
          ))}
        </div>

        {/* Architecture Section */}
        <Card id="architecture" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              1. System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm mb-4">
              <pre>{`┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Clients    │────▶│   API GW     │────▶│  Event Svc   │
│  (Web/Mobile)│     │  (Rate Limit)│     │  (Ingestion) │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     │                            ▼                            │
              ┌──────┴──────┐            ┌──────────────┐            ┌─────────┴─────────┐
              │  Message Q  │◀───────────│   Fanout     │───────────▶│   Notification    │
              │  (Kafka)    │            │   Worker     │            │   Service (SSE)   │
              └──────┬──────┘            └──────────────┘            └───────────────────┘
                     │                           │
                     ▼                           ▼
              ┌──────────────┐           ┌──────────────┐
              │  Analytics   │           │   Feed DB    │
              │  (ClickHouse)│           │  (Postgres)  │
              └──────────────┘           └──────────────┘`}</pre>
            </div>

            <h4 className="text-foreground">Key Components:</h4>
            <ul className="text-muted-foreground">
              <li><strong className="text-foreground">API Gateway:</strong> Rate limiting, auth validation, request routing</li>
              <li><strong className="text-foreground">Event Service:</strong> Validates and persists events, publishes to message queue</li>
              <li><strong className="text-foreground">Fanout Worker:</strong> Consumes events, writes to user feeds (hybrid strategy)</li>
              <li><strong className="text-foreground">Notification Service:</strong> Manages SSE connections, pushes real-time updates</li>
              <li><strong className="text-foreground">Analytics Service:</strong> Processes windowed aggregations for top-100</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Model Section */}
        <Card id="data-model" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              2. Data Model & Indexing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
              <pre>{`-- Events table (write-optimized, append-only)
CREATE TABLE events (
  event_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      VARCHAR(64) NOT NULL,
  verb          VARCHAR(32) NOT NULL,
  object_type   VARCHAR(32) NOT NULL,
  object_id     VARCHAR(64) NOT NULL,
  metadata      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User feeds (read-optimized, denormalized)
CREATE TABLE user_feeds (
  user_id       VARCHAR(64) NOT NULL,
  event_id      UUID NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, created_at, event_id)
) PARTITION BY RANGE (created_at);

-- Indexes
CREATE INDEX idx_events_object ON events (object_id, created_at DESC);
CREATE INDEX idx_events_actor ON events (actor_id, created_at DESC);
CREATE INDEX idx_feeds_cursor ON user_feeds (user_id, created_at DESC);`}</pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Why This Works
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Partitioned feeds for fast cursor-based pagination</li>
                  <li>• Composite primary key enables efficient range scans</li>
                  <li>• JSONB for flexible metadata without schema changes</li>
                  <li>• Time-based partitions for easy data lifecycle management</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  Performance Considerations
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• P95 read latency: &lt;10ms with proper indexing</li>
                  <li>• Write throughput: 10K+ events/sec with batching</li>
                  <li>• 200M events ≈ 100-400GB storage (with compression)</li>
                  <li>• Hot partition handling via time-based sharding</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fanout Strategy */}
        <Card id="fanout" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              3. Fanout Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use a <strong className="text-foreground">hybrid fanout strategy</strong> to balance 
              write amplification with read latency:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <h4 className="font-medium mb-2">Fanout-on-Write (for most users)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-compute feeds at write time</li>
                  <li>• Fast reads (single query)</li>
                  <li>• Works well for users with &lt;10K followers</li>
                  <li>• Async via message queue</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-medium mb-2">Fanout-on-Read (for celebrities)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Compute feed at read time</li>
                  <li>• Avoids massive write amplification</li>
                  <li>• Applied for users with &gt;10K followers</li>
                  <li>• Merge with cached celebrity events</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs text-muted-foreground">Fanout-on-Write</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <div className="text-2xl font-bold">5%</div>
                <div className="text-xs text-muted-foreground">Fanout-on-Read</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <div className="text-2xl font-bold">&lt;50ms</div>
                <div className="text-xs text-muted-foreground">P95 Feed Latency</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Caching */}
        <Card id="caching" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              4. Caching Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Badge variant="outline" className="shrink-0">L1</Badge>
                <div>
                  <h4 className="font-medium">Hot Feed Cache (Redis)</h4>
                  <p className="text-sm text-muted-foreground">
                    Last 100 events per active user. TTL: 15 minutes. 
                    Invalidated on new fanout write.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Badge variant="outline" className="shrink-0">L2</Badge>
                <div>
                  <h4 className="font-medium">Cursor Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Materialized cursor positions for pagination stability. 
                    Prevents phantom reads during active scrolling.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Badge variant="outline" className="shrink-0">L3</Badge>
                <div>
                  <h4 className="font-medium">Celebrity Event Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Recent events from high-follower users. Used for 
                    fanout-on-read merge operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Cache Invalidation
              </h4>
              <p className="text-sm text-muted-foreground">
                We use a write-through pattern with async invalidation. 
                Cache misses fall back to DB with a read-aside fill. 
                Stampede protection via probabilistic early expiration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Guarantees */}
        <Card id="delivery" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              5. Delivery Guarantees & Idempotency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-3">Event Ingestion</h4>
                <Badge className="mb-2">At-Least-Once</Badge>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• Client-generated idempotency key</li>
                  <li>• Deduplication window: 24 hours</li>
                  <li>• Redis-based dedup with TTL</li>
                  <li>• Retry with exponential backoff</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-3">Notification Delivery</h4>
                <Badge variant="secondary" className="mb-2">At-Most-Once (Real-time)</Badge>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• SSE for push notifications</li>
                  <li>• Polling fallback for reliability</li>
                  <li>• Client-side deduplication by event_id</li>
                  <li>• Missed events caught by polling</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
              <pre>{`// Idempotency implementation
const processEvent = async (event, idempotencyKey) => {
  const exists = await redis.get(\`idemp:\${idempotencyKey}\`);
  if (exists) return { status: 'duplicate', event_id: exists };
  
  const event_id = await db.insertEvent(event);
  await redis.setex(\`idemp:\${idempotencyKey}\`, 86400, event_id);
  
  return { status: 'created', event_id };
};`}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Scaling Plan */}
        <Card id="scaling" className="glass-card scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              6. Scaling Plan (10× Traffic)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3">Component</th>
                    <th className="text-left py-2 px-3">Current</th>
                    <th className="text-left py-2 px-3">10× Scale</th>
                    <th className="text-left py-2 px-3">Strategy</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">API Servers</td>
                    <td className="py-2 px-3">4 instances</td>
                    <td className="py-2 px-3">40 instances</td>
                    <td className="py-2 px-3">Horizontal auto-scaling</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">Database</td>
                    <td className="py-2 px-3">Primary + 2 replicas</td>
                    <td className="py-2 px-3">Sharded + 4 replicas/shard</td>
                    <td className="py-2 px-3">Shard by user_id hash</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">Cache</td>
                    <td className="py-2 px-3">Redis cluster (6 nodes)</td>
                    <td className="py-2 px-3">Redis cluster (24 nodes)</td>
                    <td className="py-2 px-3">Add shards, increase memory</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">Message Queue</td>
                    <td className="py-2 px-3">Kafka (3 brokers)</td>
                    <td className="py-2 px-3">Kafka (12 brokers)</td>
                    <td className="py-2 px-3">Increase partitions</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-foreground">SSE Servers</td>
                    <td className="py-2 px-3">2K connections</td>
                    <td className="py-2 px-3">20K connections</td>
                    <td className="py-2 px-3">Sticky sessions + pub/sub</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Failure Modes & Mitigations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Dropped Events:</strong> Kafka provides durability; consumer lag monitoring triggers alerts</li>
                <li><strong className="text-foreground">Reconnect Storms:</strong> Exponential backoff with jitter; connection admission control</li>
                <li><strong className="text-foreground">Backpressure:</strong> Rate limiting per user; graceful degradation to polling</li>
                <li><strong className="text-foreground">Hot Partitions:</strong> Consistent hashing with virtual nodes; rebalancing automation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Performance Benchmarks Placeholder */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>7. Performance Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Run load tests with Apache Bench to populate this section:
            </p>
            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
              <pre>{`# Example load test commands
ab -c 200 -n 2000 http://localhost:3000/feed?user_id=test
ab -c 600 -n 6000 http://localhost:3000/feed?user_id=test
ab -c 1000 -n 10000 http://localhost:3000/feed?user_id=test

# For different event counts
# Seed: 100k, 300k, 500k, 700k, 900k events
# Concurrency: 200, 600, 1000, 1400, 1800`}</pre>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default DesignDoc;
