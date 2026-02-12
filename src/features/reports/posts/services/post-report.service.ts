import { prismaThread } from '@/lib/prisma-thread';
import { PostReport } from '../components/columns';

export const getPostReports = async (): Promise<PostReport[]> => {
  // Group reports by threads_id and count them
  const groupedReports = await prismaThread.threadReports.groupBy({
    by: ['threads_id'],
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
    take: 20
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

  return groupedReports.map((grouped) => {
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
        ? new Date(grouped._max.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
    };
  });
};
