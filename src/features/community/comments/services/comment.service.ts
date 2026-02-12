import { prisma } from '@/lib/prisma';

export interface CommentData {
  id: number;
  symbol: string;
  content: string;
  userId: number;
  likes: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GetCommentsParams {
  page?: number;
  pageSize?: number;
  createdAt?: number[]; // [from, to] timestamp
  search?: string;
}

export async function getComments(params: GetCommentsParams = {}) {
  const { page = 1, pageSize = 10, createdAt, search } = params;
  const where: any = {};

  if (createdAt && createdAt.length === 2) {
    where.created_at = {
      gte: new Date(createdAt[0]),
      lte: new Date(createdAt[1])
    };
  }

  if (search) {
    where.content = { contains: search, mode: 'insensitive' };
  }

  const [comments, totalCount] = await Promise.all([
    prisma.comments.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' }
    }),
    prisma.comments.count({ where })
  ]);

  const data: CommentData[] = comments.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    content: c.content,
    userId: c.user_id,
    likes: c.likes || 0,
    createdAt: c.created_at,
    updatedAt: c.updated_at
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
