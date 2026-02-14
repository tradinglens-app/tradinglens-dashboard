import { prisma } from '@/lib/prisma';

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  profile_pic: string | null;
  created_at: Date;
}

export async function getRecentUsers(): Promise<RecentUser[]> {
  try {
    const users = await prisma.users.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 5,
      select: {
        user_id: true,
        name: true,
        email: true,
        profile_pic: true,
        created_at: true
      }
    });

    return users.map((user) => ({
      id: user.user_id,
      name: user.name,
      email: user.email || 'No email',
      profile_pic: user.profile_pic,
      created_at: user.created_at || new Date()
    }));
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
}
