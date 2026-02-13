import { delay } from '@/constants/mock-api';
import { RecentRegistrations } from '@/features/overview/components/recent-registrations';
import { getRecentUsers } from '@/features/overview/services/recent-users.service';

export default async function Sales() {
  await delay(1000);
  const recentUsers = await getRecentUsers();
  return <RecentRegistrations users={recentUsers} />;
}
