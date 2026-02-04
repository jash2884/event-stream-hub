import { MainLayout } from '@/components/layout/MainLayout';
import { ActivityFeed } from '@/components/feed/ActivityFeed';
import { EventSimulator } from '@/components/simulator/EventSimulator';
import { ApiPlayground } from '@/components/api/ApiPlayground';
import { SystemMetricsPanel } from '@/components/analytics/SystemMetricsPanel';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EventSimulator />
          <SystemMetricsPanel />
          <ApiPlayground />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Index;
