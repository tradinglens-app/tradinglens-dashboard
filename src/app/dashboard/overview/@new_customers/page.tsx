import { delay } from '@/constants/mock-api';
import { StatsCard } from '@/features/overview/components/stats-card';
import { getNewCustomersStats } from '@/features/overview/services/new-customers.service';

export default async function NewCustomers() {
  await delay(1000);

  const stats = await getNewCustomersStats();

  return (
    <StatsCard
      title='New Customers'
      value={stats.currentMonth}
      percentageChange={stats.percentageChange}
      trend={stats.trend}
      description='User distribution by platform'
    />
  );
}
