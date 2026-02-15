import { prisma } from '@/lib/prisma';

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  profile_pic: string | null;
  created_at: Date;
}

export async function getRecentUsers(): Promise<{
  users: RecentUser[];
  todayCount: number;
}> {
  try {
    const users = await prisma.users.findMany({
      orderBy: {
        created_at: 'desc'
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        profile_pic: true,
        created_at: true
      }
    });

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const todayCount = await prisma.users.count({
      where: {
        created_at: {
          gte: startOfToday
        }
      }
    });

    const mappedUsers = users.map((user) => ({
      id: user.user_id,
      name: user.name,
      email: user.email || 'No email',
      profile_pic: user.profile_pic,
      created_at: user.created_at || new Date()
    }));

    return {
      users: mappedUsers,
      todayCount
    };
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return {
      users: [],
      todayCount: 0
    };
  }
}
