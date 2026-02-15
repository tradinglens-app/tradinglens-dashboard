import { delay } from '@/constants/mock-api';
import { RecentRegistrationsClient } from '@/features/overview/components/recent-registrations-client';
import { getRecentUsers } from '@/features/overview/services/recent-users.service';

export default async function Sales() {
  await delay(1000);
  const { users, todayCount } = await getRecentUsers();
  return (
    <RecentRegistrationsClient
      initialUsers={users}
      initialTodayCount={todayCount}
    />
  );
}
