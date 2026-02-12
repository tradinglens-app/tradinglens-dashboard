import { prisma } from '@/lib/prisma';

export interface GetBugReportsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string | string[];
  from?: string;
  to?: string;
}

export async function getBugReportsService(params: GetBugReportsParams = {}) {
  const { page = 1, pageSize = 10, search, status, from, to } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { topic: { contains: search, mode: 'insensitive' } },
      { details: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (status && status.length > 0) {
    where.status = {
      in: Array.isArray(status) ? status : [status]
    };
  }

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at.gte = new Date(from);
    if (to) where.created_at.lte = new Date(to);
  }

  const [reports, totalCount] = await Promise.all([
    prisma.app_problem_report.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' }
    }),
    prisma.app_problem_report.count({ where })
  ]);

  return {
    data: reports,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
