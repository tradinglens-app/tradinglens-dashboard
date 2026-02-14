import { prisma } from '@/lib/prisma';

export interface StatItem {
  current: number;
  previous: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardStats {
  totalUsers: StatItem;
  iosUsers: StatItem;
  androidUsers: StatItem;
}

function calculateTrend(
  current: number,
  previous: number
): { percentage: number; trend: 'up' | 'down' | 'neutral' } {
  let percentage = 0;
  let trend: 'up' | 'down' | 'neutral' = 'neutral';

  if (previous > 0) {
    percentage = ((current - previous) / previous) * 100;
    if (percentage > 0.01) trend = 'up';
    else if (percentage < -0.01) trend = 'down';
  } else if (current > 0) {
    percentage = 100;
    trend = 'up';
  }

  return { percentage: Math.round(percentage), trend };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date();
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // 1. Total Users
    const currentTotalUsers = await prisma.users.count();
    const previousTotalUsers = await prisma.users.count({
      where: {
        created_at: { lte: lastMonthEnd }
      }
    });

    // 2. iOS Users (Distinct users who have at least one iOS device)
    const currentIosUsers = (
      await prisma.user_devices.findMany({
        where: { platform: 'ios' },
        distinct: ['user_id'],
        select: { user_id: true }
      })
    ).length;

    const previousIosUsers = (
      await prisma.user_devices.findMany({
        where: {
          platform: 'ios',
          created_at: { lte: lastMonthEnd }
        },
        distinct: ['user_id'],
        select: { user_id: true }
      })
    ).length;

    // 3. Android Users
    const currentAndroidUsers = (
      await prisma.user_devices.findMany({
        where: { platform: 'android' },
        distinct: ['user_id'],
        select: { user_id: true }
      })
    ).length;

    const previousAndroidUsers = (
      await prisma.user_devices.findMany({
        where: {
          platform: 'android',
          created_at: { lte: lastMonthEnd }
        },
        distinct: ['user_id'],
        select: { user_id: true }
      })
    ).length;

    const totalStats = calculateTrend(currentTotalUsers, previousTotalUsers);
    const iosStats = calculateTrend(currentIosUsers, previousIosUsers);
    const androidStats = calculateTrend(
      currentAndroidUsers,
      previousAndroidUsers
    );

    return {
      totalUsers: {
        current: currentTotalUsers,
        previous: previousTotalUsers,
        percentageChange: totalStats.percentage,
        trend: totalStats.trend
      },
      iosUsers: {
        current: currentIosUsers,
        previous: previousIosUsers,
        percentageChange: iosStats.percentage,
        trend: iosStats.trend
      },
      androidUsers: {
        current: currentAndroidUsers,
        previous: previousAndroidUsers,
        percentageChange: androidStats.percentage,
        trend: androidStats.trend
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    const emptyStat: StatItem = {
      current: 0,
      previous: 0,
      percentageChange: 0,
      trend: 'neutral'
    };
    return {
      totalUsers: emptyStat,
      iosUsers: emptyStat,
      androidUsers: emptyStat
    };
  }
}
