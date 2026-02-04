import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemMetrics } from '@/types/events';
import { generateMetrics } from '@/lib/mockData';
import { Cpu, HardDrive, Gauge, Activity } from 'lucide-react';

export function SystemMetricsPanel() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<SystemMetrics[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);
      setHistory(prev => [...prev.slice(-29), newMetrics]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) return null;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          System Metrics (Live)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <MetricGauge
            label="CPU Usage"
            value={metrics.cpu_percent}
            max={100}
            unit="%"
            icon={<Cpu className="h-4 w-4" />}
            color="primary"
          />
          <MetricGauge
            label="Memory"
            value={metrics.memory_usage_mb}
            max={1024}
            unit="MB"
            icon={<HardDrive className="h-4 w-4" />}
            color="accent"
          />
        </div>

        {/* Mini sparkline */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Events/sec (30s window)</span>
            <span className="text-xs font-mono">{metrics.events_per_second}/s</span>
          </div>
          <div className="h-12 flex items-end gap-0.5">
            {history.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/60 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(h.events_per_second / 600) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricGauge({ 
  label, 
  value, 
  max, 
  unit, 
  icon,
  color 
}: { 
  label: string; 
  value: number; 
  max: number; 
  unit: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent';
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <span className="text-sm font-mono font-medium">
          {value}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color === 'primary' ? 'bg-primary' : 'bg-accent'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
