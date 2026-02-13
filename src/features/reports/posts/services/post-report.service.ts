import { prismaThread } from '@/lib/prisma-thread';
import { format } from 'date-fns';
import { PostReport } from '../components/columns';

export interface GetPostReportsParams {
  page?: number;
  pageSize?: number;
  id?: string;
  postTitle?: string;
  from?: string;
  to?: string;
}

// Basic UUID regex check
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const getPostReports = async (
  params: GetPostReportsParams = {}
): Promise<{ data: PostReport[]; totalCount: number }> => {
  const { page = 1, pageSize = 10, id, postTitle, from, to } = params;

  // 1. Filter Threads by Content (Post Title) first if provided
  let threadIdsFromTitle: string[] | undefined;
  if (postTitle) {
    const matchingThreads = await prismaThread.threads.findMany({
      where: {
        content: {
          contains: postTitle,
          mode: 'insensitive'
        }
      },
      select: { id: true }
    });
    threadIdsFromTitle = matchingThreads.map((t) => t.id);
  }

  // 2. Prepare where clause for Thread Reports
  const where: any = {};

  if (threadIdsFromTitle) {
    where.threads_id = { in: threadIdsFromTitle };
  }

  if (id) {
    if (isUUID(id)) {
      // If filtering by ID (which is threads_id in this context logic),
      // we need to combine it with potential title filter
      if (where.threads_id) {
        // Intersection of title matches and specific ID
        if (threadIdsFromTitle?.includes(id)) {
          where.threads_id = id;
        } else {
          // Title found some threads, ID is valid, but ID is not in title matches -> No result
          where.threads_id = '00000000-0000-0000-0000-000000000000';
        }
      } else {
        where.threads_id = id;
      }
    } else {
      // Invalid UUID for ID search -> No result
      where.threads_id = '00000000-0000-0000-0000-000000000000';
    }
  }

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at.gte = new Date(from);
    if (to) where.created_at.lte = new Date(to);
  }

  console.log('Final where clause:', JSON.stringify(where, null, 2));

  // 3. Get Total Count of unique threads matching criteria
  // Since we group by threads_id, we need to count unique threads_id in the filtered reports
  // Prisma groupBy doesn't give a direct total count of groups easily with pagination,
  // so we might use a separate count or fetch all groups (if not too large) or distinct count.
  // Performance-wise for this setup:
  const distinctThreads = await prismaThread.threadReports.findMany({
    where,
    distinct: ['threads_id'],
    select: { threads_id: true }
  });
  const totalCount = distinctThreads.length;

  // 4. Fetch Paginated Grouped Reports
  const groupedReports = await prismaThread.threadReports.groupBy({
    by: ['threads_id'],
    where,
    _count: {
      id: true
    },
    _max: {
      created_at: true
    },
    orderBy: {
      _max: {
        created_at: 'desc'
      }
    },
    take: pageSize,
    skip: (page - 1) * pageSize
  });

  // Get the thread IDs from grouped results
  const threadIds = groupedReports.map((r) => r.threads_id);

  // Fetch all reports for these threads to get reasons
  const allReports = await prismaThread.threadReports.findMany({
    where: {
      threads_id: { in: threadIds }
    },
    select: {
      threads_id: true,
      reason: true
    }
  });

  // Fetch related threads to get content
  const threads = await prismaThread.threads.findMany({
    where: {
      id: { in: threadIds }
    },
    select: {
      id: true,
      content: true
    }
  });

  // Fetch ThreadReportReasons for reports that have a reason UUID
  const reasonIds = allReports
    .map((r) => r.reason)
    .filter((reason): reason is string => !!reason);

  const reportReasons = await prismaThread.threadReportReasons.findMany({
    where: {
      id: { in: reasonIds }
    }
  });

  const threadMap = new Map(threads.map((t) => [t.id, t]));
  const reasonMap = new Map(reportReasons.map((r) => [r.id, r]));

  // Group reports by thread_id for reason aggregation
  const reportsByThread = new Map<string, typeof allReports>();
  allReports.forEach((report) => {
    if (!reportsByThread.has(report.threads_id)) {
      reportsByThread.set(report.threads_id, []);
    }
    reportsByThread.get(report.threads_id)!.push(report);
  });

  const data = groupedReports.map((grouped) => {
    const thread = threadMap.get(grouped.threads_id);
    const content = thread?.content || 'Content not found';
    const threadReports = reportsByThread.get(grouped.threads_id) || [];

    // Get all unique reasons for this thread
    const uniqueReasonIds = Array.from(
      new Set(
        threadReports
          .map((r) => r.reason)
          .filter((reason): reason is string => !!reason)
      )
    );

    // Collect all reason translations as individual objects
    const reasons = uniqueReasonIds.map((reasonId) => {
      const reportReason = reasonMap.get(reasonId);
      if (reportReason && reportReason.translations) {
        const translations = reportReason.translations as {
          th?: { title?: string; description?: string };
          en?: { title?: string; description?: string };
        };
        return {
          titleEn: translations.en?.title,
          descriptionEn: translations.en?.description,
          titleTh: translations.th?.title,
          descriptionTh: translations.th?.description
        };
      }
      return {
        titleEn: undefined,
        descriptionEn: undefined,
        titleTh: undefined,
        descriptionTh: undefined
      };
    });

    return {
      id: grouped.threads_id,
      postTitle: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      reasons,
      reportCount: grouped._count.id,
      date: grouped._max.created_at
        ? format(new Date(grouped._max.created_at), 'MMM d, yyyy h:mm a')
        : 'N/A',
      created_at: grouped._max.created_at
        ? grouped._max.created_at.toISOString()
        : ''
    };
  });

  return { data, totalCount };
};
