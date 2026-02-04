import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, Zap } from 'lucide-react';
import { TopItem, SystemMetrics, Verb } from '@/types/events';
import { generateTopItems, generateMetrics } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type TimeWindow = '1m' | '5m' | '1h';

const verbColors: Record<Verb, string> = {
  like: 'bg-verb-like',
  comment: 'bg-verb-comment',
  follow: 'bg-verb-follow',
  purchase: 'bg-verb-purchase',
  share: 'bg-verb-share',
  mention: 'bg-verb-mention',
};

export function TopItemsChart() {
  const [window, setWindow] = useState<TimeWindow>('1m');
  const [items, setItems] = useState<TopItem[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setItems(generateTopItems(100));
    setMetrics(generateMetrics());
  }, [window]);

  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setItems(generateTopItems(100));
      setMetrics(generateMetrics());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const topItems = useMemo(() => items.slice(0, 20), [items]);
  const maxCount = topItems[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 100 Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Most frequent objects by activity count (sliding window)
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time window selector */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            {(['1m', '5m', '1h'] as TimeWindow[]).map((w) => (
              <Button
                key={w}
                variant={window === w ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setWindow(w)}
                className="gap-1"
              >
                <Clock className="h-3 w-3" />
                {w}
              </Button>
            ))}
          </div>
          
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <Zap className={cn('h-4 w-4', isLive && 'animate-pulse')} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* Metrics cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Events/sec"
            value={metrics.events_per_second}
            icon={<Zap className="h-4 w-4" />}
          />
          <MetricCard
            label="Active Connections"
            value={metrics.active_connections}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <MetricCard
            label="P95 Latency"
            value={`${metrics.p95_latency_ms}ms`}
            icon={<Clock className="h-4 w-4" />}
          />
          <MetricCard
            label="Total Events"
            value={formatNumber(metrics.total_events)}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Top items bar chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top 20 Objects by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topItems.map((item, index) => (
              <motion.div
                key={item.object_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium truncate max-w-48">
                      {item.object_title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.object_type})
                    </span>
                  </div>
                  <span className="text-sm font-mono font-medium">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                
                {/* Stacked bar */}
                <div className="flex h-5 rounded overflow-hidden bg-muted/30">
                  {(Object.entries(item.verbs) as [Verb, number][]).map(([verb, count]) => {
                    const width = (count / maxCount) * 100;
                    return (
                      <motion.div
                        key={verb}
                        className={cn('h-full transition-all', verbColors[verb])}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        title={`${verb}: ${count}`}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
            {(Object.keys(verbColors) as Verb[]).map((verb) => (
              <div key={verb} className="flex items-center gap-1.5">
                <div className={cn('h-3 w-3 rounded', verbColors[verb])} />
                <span className="text-xs text-muted-foreground capitalize">{verb}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="glass-card stat-card">
      <CardContent className="relative p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="text-2xl font-bold font-mono">{value}</p>
      </CardContent>
    </Card>
  );
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}
