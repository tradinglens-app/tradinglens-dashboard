import { prisma } from '@/lib/prisma';

export interface NewCustomersStats {
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
}

export async function getNewCustomersStats(): Promise<NewCustomersStats> {
  try {
    const now = new Date();

    // Calculate date ranges
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    console.log('Date ranges:', {
      currentMonth: { start: currentMonthStart, end: currentMonthEnd },
      previousMonth: { start: previousMonthStart, end: previousMonthEnd }
    });

    // Count users created in current month
    const currentMonthCount = await prisma.users.count({
      where: {
        created_at: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    });

    // Count users created in previous month
    const previousMonthCount = await prisma.users.count({
      where: {
        created_at: {
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    });

    console.log('User counts:', {
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount
    });

    // Calculate percentage change
    let percentageChange = 0;
    let trend: 'up' | 'down' | 'neutral' = 'neutral';

    if (previousMonthCount > 0) {
      percentageChange =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;

      if (percentageChange > 0) {
        trend = 'up';
      } else if (percentageChange < 0) {
        trend = 'down';
      }
    } else if (currentMonthCount > 0) {
      // If there were no users last month but there are this month
      percentageChange = 100;
      trend = 'up';
    }

    return {
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
      percentageChange: Math.round(percentageChange),
      trend
    };
  } catch (error) {
    console.error('Error fetching new customers stats:', error);
    return {
      currentMonth: 0,
      previousMonth: 0,
      percentageChange: 0,
      trend: 'neutral'
    };
  }
}
