import { prisma } from '@/lib/prisma';
import { getDistinctValues } from '@/lib/db-enums.service';

export async function getBugReportEnumValues(): Promise<
  Record<string, string[]>
> {
  const status = await getDistinctValues(
    'app_problem_report',
    'status',
    'main'
  );
  return { status };
}

export interface GetBugReportsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  id?: string;
  topic?: string;
  status?: string | string[];
  from?: string;
  to?: string;
}

// Basic UUID regex check
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function getBugReportsService(params: GetBugReportsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    id,
    topic,
    status,
    from,
    to
  } = params;

  const where: any = {};

  if (search) {
    const searchConditions: any[] = [
      { topic: { contains: search, mode: 'insensitive' } },
      { details: { contains: search, mode: 'insensitive' } }
    ];

    if (isUUID(search)) {
      searchConditions.push({ id: { equals: search } });
    }

    where.OR = searchConditions;
  }

  if (id) {
    // If exact ID search is requested
    if (isUUID(id)) {
      where.id = { equals: id };
    } else {
      // If invalid UUID provided for explicit ID search, force no results
      // or we could just ignore it, but 'no results' is more accurate for "id=invalid"
      where.id = { equals: '00000000-0000-0000-0000-000000000000' }; // Dummy UUID
    }
  }

  if (topic) {
    where.topic = { contains: topic, mode: 'insensitive' };
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
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        topic: true,
        status: true,
        created_at: true
        // Exclude: details, user_id, platform, app_version, device_info, screenshots, updated_at
      }
    }),
    prisma.app_problem_report.count({ where })
  ]);

  return {
    data: reports,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
