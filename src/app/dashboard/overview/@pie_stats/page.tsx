import { UserVerificationPie } from '@/features/overview/components/user-verification-pie';
import { getOverviewData } from '@/features/overview/services/overview-data.service';

export default async function Stats() {
  const { verification } = await getOverviewData();
  return <UserVerificationPie stats={verification} />;
}
