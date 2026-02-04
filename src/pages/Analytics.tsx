import { MainLayout } from '@/components/layout/MainLayout';
import { TopItemsChart } from '@/components/analytics/TopItemsChart';
import { motion } from 'framer-motion';

const Analytics = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TopItemsChart />
      </motion.div>
    </MainLayout>
  );
};

export default Analytics;
