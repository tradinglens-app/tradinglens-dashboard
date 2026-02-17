import { StatsCard } from '@/features/overview/components/stats-card';
import { getOverviewData } from '@/features/overview/services/overview-data.service';

export default async function NewCustomers() {
  const { newCustomers } = await getOverviewData();

  return (
    <StatsCard
      title='New Users'
      value={newCustomers.currentMonth}
      percentageChange={newCustomers.percentageChange}
      trend={newCustomers.trend}
      description='New user registrations in the current period'
    />
  );
}
