import { prisma } from '@/lib/prisma';

export interface MonthlyGrowth {
  month: string;
  users: number;
}

export async function getPlatformGrowthStats(): Promise<MonthlyGrowth[]> {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Fetch all users created in the current year
    const startOfYear = new Date(currentYear, 0, 1);
    const allUsers = await prisma.users.findMany({
      select: {
        created_at: true
      },
      where: {
        created_at: {
          gte: startOfYear
        }
      }
    });

    // Initialize months from January to current month
    const growthMap = new Map<string, number>();
    const months: string[] = [];

    for (let i = 0; i <= 11; i++) {
      const d = new Date(currentYear, i, 1);
      const monthName = d.toLocaleString('default', { month: 'long' });
      growthMap.set(monthName, 0);
      months.push(monthName);
    }

    allUsers.forEach((user) => {
      if (!user.created_at) return;
      const monthName = user.created_at.toLocaleString('default', {
        month: 'long'
      });
      if (growthMap.has(monthName)) {
        growthMap.set(monthName, growthMap.get(monthName)! + 1);
      }
    });

    return months.map((month) => ({
      month,
      users: growthMap.get(month) || 0
    }));
  } catch (error) {
    console.error('Error fetching platform growth stats:', error);
    return [];
  }
}
