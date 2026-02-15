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
  sort?: string;
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
    to,
    sort
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

  // Sorting
  let orderBy: any = { created_at: 'desc' };

  if (sort) {
    try {
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        const { id, desc } = parsedSort[0];
        const fieldMapping: Record<string, string> = {
          topic: 'topic',
          details: 'details',
          status: 'status',
          created_at: 'created_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        };
        const dbField = fieldMapping[id] || id;
        orderBy = { [dbField]: desc ? 'desc' : 'asc' }; // Corrected line 101 to be a single assignment
      }
    } catch (e) {
      // Keep default sorting
    }
  }

  const [reports, totalCount] = await Promise.all([
    prisma.app_problem_report.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy,
      select: {
        id: true,
        topic: true,
        details: true,
        status: true,
        created_at: true,
        updated_at: true
        // Exclude: user_id, platform, app_version, device_info, screenshots, updated_at
        // Exclude: user_id, platform, app_version, device_info, screenshots
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
