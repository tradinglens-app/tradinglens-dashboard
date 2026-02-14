import { delay } from '@/constants/mock-api';
import { UserVerificationPie } from '@/features/overview/components/user-verification-pie';
import { getUserVerificationStats } from '@/features/overview/services/user-verification.service';

export default async function Stats() {
  await delay(1000);
  const stats = await getUserVerificationStats();
  return <UserVerificationPie stats={stats} />;
}
