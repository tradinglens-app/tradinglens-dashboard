import { prisma as prismaMain } from '@/lib/prisma';
import { prismaThread } from '@/lib/prisma-thread';
import { Threads } from '@/generated/prisma-client-thread';

export interface Post extends Threads {
  user?: {
    name: string | null;
    username: string | null;
    profile_pic: string | null;
  };
}

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  id?: string;
  created_at?: number[];
  visibility?: string[];
}

export async function getPosts(params: GetPostsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    id,
    created_at,
    visibility
  } = params;

  const where: any = {
    deleted_at: null,
    parent_thread_id: null // Only fetch top-level threads (posts), not replies
  };

  if (search) {
    where.content = {
      contains: search,
      mode: 'insensitive'
    };
  }

  if (id) {
    where.id = {
      contains: id,
      mode: 'insensitive'
    };
  }

  if (visibility && visibility.length > 0) {
    where.visibility = {
      in: visibility
    };
  }

  if (created_at && created_at.length === 2) {
    const [start, end] = created_at;
    if (start && end) {
      where.created_at = {
        gte: new Date(start),
        lte: new Date(end)
      };
    }
  }

  // 1. Fetch Threads from Thread DB
  const [threads, totalCount] = await Promise.all([
    prismaThread.threads.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' }
    }),
    prismaThread.threads.count({ where })
  ]);

  // 2. Extract User IDs
  const userIds = Array.from(new Set(threads.map((t) => t.user_id)));

  // 3. Fetch Users from Main DB
  const users = await prismaMain.users.findMany({
    where: {
      user_id: { in: userIds }
    },
    select: {
      user_id: true,
      name: true,
      username: true,
      profile_pic: true
    }
  });

  // 4. Map Users to Threads
  const userMap = new Map(users.map((u) => [u.user_id, u]));

  const data: Post[] = threads.map((thread) => ({
    ...thread,
    user: userMap.get(thread.user_id) || {
      name: 'Unknown User',
      username: 'unknown',
      profile_pic: null
    }
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
