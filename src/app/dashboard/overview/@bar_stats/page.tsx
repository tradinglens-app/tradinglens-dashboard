import { delay } from '@/constants/mock-api';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { getPlatformAnalytics } from '@/features/overview/services/platform-analytics.service';

export default async function BarStats() {
  await delay(1000);

  const dailyData = await getPlatformAnalytics();

  return <BarGraph dailyData={dailyData} />;
}
