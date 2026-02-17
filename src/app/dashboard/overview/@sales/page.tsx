import { RecentRegistrationsClient } from '@/features/overview/components/recent-registrations-client';
import { getOverviewData } from '@/features/overview/services/overview-data.service';

export default async function Sales() {
  const { recentUsers } = await getOverviewData();
  return (
    <RecentRegistrationsClient
      initialUsers={recentUsers.users}
      initialTodayCount={recentUsers.todayCount}
    />
  );
}
