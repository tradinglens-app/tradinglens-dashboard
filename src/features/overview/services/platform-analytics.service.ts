import { prisma } from '@/lib/prisma';

export interface DailyPlatformStats {
  date: string;
  ios: number;
  android: number;
}

export async function getPlatformAnalytics(): Promise<DailyPlatformStats[]> {
  try {
    // Get data for the last 3 months grouped by date and platform
    const result = await prisma.$queryRaw<
      Array<{
        date: Date;
        platform: string;
        count: bigint;
      }>
    >`
      SELECT 
        DATE(last_active_at) as date,
        platform,
        COUNT(DISTINCT user_id) as count
      FROM user_devices
      WHERE platform IN ('ios', 'android')
        AND last_active_at >= CURRENT_DATE - INTERVAL '3 months'
      GROUP BY DATE(last_active_at), platform
      ORDER BY date ASC
    `;

    // Transform the data into the format needed for the chart
    const datesMap = new Map<string, DailyPlatformStats>();

    // Initialize all days for the last 3 months
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    for (
      let d = new Date(threeMonthsAgo);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD format
      datesMap.set(dateKey, {
        date: dateKey,
        ios: 0,
        android: 0
      });
    }

    // Fill in the actual data
    result.forEach((row: { date: Date; platform: string; count: bigint }) => {
      const dateKey = new Date(row.date).toISOString().split('T')[0];
      const existing = datesMap.get(dateKey);
      if (existing) {
        if (row.platform === 'ios') {
          existing.ios = Number(row.count);
        } else if (row.platform === 'android') {
          existing.android = Number(row.count);
        }
      }
    });

    const chartData = Array.from(datesMap.values());

    return chartData;
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    // Return empty data for last 3 months instead of throwing
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const fallbackData: DailyPlatformStats[] = [];
    for (
      let d = new Date(threeMonthsAgo);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      fallbackData.push({
        date: d.toISOString().split('T')[0],
        ios: 0,
        android: 0
      });
    }
    return fallbackData;
  }
}
