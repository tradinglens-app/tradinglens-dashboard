import { prisma } from '@/lib/prisma';

export interface MonthlyGrowth {
  month: string;
  ios: number;
  android: number;
}

export async function getPlatformGrowthStats(): Promise<MonthlyGrowth[]> {
  try {
    // Fetch all devices with created_at
    // For a production app with millions of records, use raw SQL for aggregation.
    // For this dashboard, fetching fields is acceptable.
    const devices = await prisma.user_devices.findMany({
      select: {
        platform: true,
        created_at: true
      },
      where: {
        created_at: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) // Last 6 months
        }
      }
    });

    // Group by Month
    const growthMap = new Map<string, { ios: number; android: number }>();
    const months = [];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'long' });
      const key = monthName;
      growthMap.set(key, { ios: 0, android: 0 });
      months.push(key);
    }

    devices.forEach((device) => {
      if (!device.created_at) return;
      const monthName = device.created_at.toLocaleString('default', {
        month: 'long'
      });
      if (growthMap.has(monthName)) {
        const stats = growthMap.get(monthName)!;
        if (device.platform === 'ios') stats.ios++;
        else if (device.platform === 'android') stats.android++;
      }
    });

    return months.map((month) => ({
      month,
      ios: growthMap.get(month)?.ios || 0,
      android: growthMap.get(month)?.android || 0
    }));
  } catch (error) {
    console.error('Error fetching platform growth stats:', error);
    return [];
  }
}
