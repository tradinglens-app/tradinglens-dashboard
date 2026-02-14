import { delay } from '@/constants/mock-api';
import { PlatformGrowthChart } from '@/features/overview/components/platform-growth-chart';
import { getPlatformGrowthStats } from '@/features/overview/services/platform-growth.service';

export default async function AreaStats() {
  await delay(2000);
  const data = await getPlatformGrowthStats();
  return <PlatformGrowthChart data={data} />;
}
