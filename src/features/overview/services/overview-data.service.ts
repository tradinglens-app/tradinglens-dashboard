import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export interface StatItem {
  current: number;
  previous: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  profile_pic: string | null;
  created_at: Date;
}

export interface OverviewData {
  stats: {
    totalUsers: StatItem;
    iosUsers: StatItem;
    androidUsers: StatItem;
  };
  newCustomers: {
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'neutral';
  };
  verification: {
    verified: number;
    unverified: number;
    total: number;
  };
  recentUsers: {
    users: RecentUser[];
    todayCount: number;
  };
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

export const getOverviewData = cache(async (): Promise<OverviewData> => {
  const now = new Date();
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [
    currentTotalUsers,
    previousTotalUsers,
    iosUserResults,
    iosPrevResults,
    androidUserResults,
    androidPrevResults,
    currentMonthCount,
    previousMonthCount,
    verifiedCount,
    unverifiedCount,
    recentUsers,
    todayCount
  ] = await Promise.all([
    // Total Users
    prisma.users.count(),
    prisma.users.count({ where: { created_at: { lte: lastMonthEnd } } }),
    // iOS Users
    prisma.user_devices.findMany({
      where: { platform: 'ios' },
      distinct: ['user_id'],
      select: { user_id: true }
    }),
    prisma.user_devices.findMany({
      where: { platform: 'ios', created_at: { lte: lastMonthEnd } },
      distinct: ['user_id'],
      select: { user_id: true }
    }),
    // Android Users
    prisma.user_devices.findMany({
      where: { platform: 'android' },
      distinct: ['user_id'],
      select: { user_id: true }
    }),
    prisma.user_devices.findMany({
      where: { platform: 'android', created_at: { lte: lastMonthEnd } },
      distinct: ['user_id'],
      select: { user_id: true }
    }),
    // New Customers
    prisma.users.count({
      where: { created_at: { gte: currentMonthStart, lte: now } }
    }),
    prisma.users.count({
      where: { created_at: { gte: previousMonthStart, lte: lastMonthEnd } }
    }),
    // Verification
    prisma.users.count({ where: { is_verified: true } }),
    prisma.users.count({ where: { is_verified: false } }),
    // Recent Users
    prisma.users.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        user_id: true,
        name: true,
        email: true,
        profile_pic: true,
        created_at: true
      }
    }),
    prisma.users.count({ where: { created_at: { gte: startOfToday } } })
  ]);

  const totalStats = calculateTrend(currentTotalUsers, previousTotalUsers);
  const iosStats = calculateTrend(iosUserResults.length, iosPrevResults.length);
  const androidStats = calculateTrend(
    androidUserResults.length,
    androidPrevResults.length
  );
  const newCustStats = calculateTrend(currentMonthCount, previousMonthCount);

  return {
    stats: {
      totalUsers: {
        current: currentTotalUsers,
        previous: previousTotalUsers,
        percentageChange: totalStats.percentage,
        trend: totalStats.trend
      },
      iosUsers: {
        current: iosUserResults.length,
        previous: iosPrevResults.length,
        percentageChange: iosStats.percentage,
        trend: iosStats.trend
      },
      androidUsers: {
        current: androidUserResults.length,
        previous: androidPrevResults.length,
        percentageChange: androidStats.percentage,
        trend: androidStats.trend
      }
    },
    newCustomers: {
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
      percentageChange: newCustStats.percentage,
      trend: newCustStats.trend
    },
    verification: {
      verified: verifiedCount,
      unverified: unverifiedCount,
      total: verifiedCount + unverifiedCount
    },
    recentUsers: {
      users: recentUsers.map((u) => ({
        id: u.user_id,
        name: u.name,
        email: u.email || 'No email',
        profile_pic: u.profile_pic,
        created_at: u.created_at || new Date()
      })),
      todayCount
    }
  };
});
