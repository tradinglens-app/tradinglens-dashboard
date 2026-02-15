import { Prisma } from '@/generated/prisma-client-thread';
import { prismaThread } from '@/lib/prisma-thread';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { PostReport } from '../components/post-report-table/columns';
import { Post } from '@/features/community/posts/services/posts.service';

export interface GetPostReportsParams {
  page?: number;
  pageSize?: number;
  id?: string;
  postTitle?: string;
  from?: string;
  to?: string;
  sort?: string;
}

// Basic UUID regex check
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const getPostReports = async (
  params: GetPostReportsParams = {}
): Promise<{ data: PostReport[]; totalCount: number }> => {
  const { page = 1, pageSize = 10, id, postTitle, from, to, sort } = params;

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

  const where: any = {};

  if (threadIdsFromTitle) {
    where.threads_id = { in: threadIdsFromTitle };
  }

  if (id) {
    if (isUUID(id)) {
      if (where.threads_id) {
        if (threadIdsFromTitle?.includes(id)) {
          where.threads_id = id;
        } else {
          where.threads_id = '00000000-0000-0000-0000-000000000000';
        }
      } else {
        where.threads_id = id;
      }
    } else {
      where.threads_id = '00000000-0000-0000-0000-000000000000';
    }
  }

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at.gte = new Date(from);
    if (to) where.created_at.lte = new Date(to);
  }

  const distinctThreads = await prismaThread.threadReports.findMany({
    where,
    distinct: ['threads_id'],
    select: { threads_id: true }
  });
  const totalCount = distinctThreads.length;

  let dbOrderBy:
    | { _max: { created_at: Prisma.SortOrder } }
    | { _count: { id: Prisma.SortOrder } }
    | undefined = {
    _max: { created_at: 'desc' }
  };
  let isSortedInMem = false;

  if (sort) {
    try {
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        const { id: sortId, desc } = parsedSort[0];

        if (sortId === 'reportCount') {
          dbOrderBy = { _count: { id: desc ? 'desc' : 'asc' } };
        } else if (sortId === 'created_at') {
          dbOrderBy = { _max: { created_at: desc ? 'desc' : 'asc' } };
        } else if (sortId === 'postTitle') {
          isSortedInMem = true;
        }
      }
    } catch (e) {
      console.error('Error parsing sort:', e);
    }
  }

  const groupedReports = await prismaThread.threadReports.groupBy({
    by: ['threads_id'],
    where,
    _count: {
      id: true
    },
    _max: {
      created_at: true
    },
    orderBy: dbOrderBy,
    take: pageSize,
    skip: (page - 1) * pageSize
  });

  const threadIds = groupedReports.map((r) => r.threads_id);

  const allReports = await prismaThread.threadReports.findMany({
    where: {
      threads_id: { in: threadIds }
    },
    select: {
      threads_id: true,
      reason: true
    }
  });

  const threads = await prismaThread.threads.findMany({
    where: {
      id: { in: threadIds }
    },
    select: {
      id: true,
      user_id: true,
      content: true,
      visibility: true,
      created_at: true,
      updated_at: true,
      poll_id: true,
      company_info_id: true,
      quoted_thread_id: true,
      news_id: true,
      parent_thread_id: true,
      parent_level: true,
      start_thread_id: true
    }
  });

  const userIds = Array.from(new Set(threads.map((t) => t.user_id)));
  const threadIdList = threads.map((t) => t.id);

  const [users, media] = await Promise.all([
    prisma.users.findMany({
      where: {
        user_id: { in: userIds }
      },
      select: {
        user_id: true,
        name: true,
        username: true,
        profile_pic: true
      }
    }),
    prismaThread.threadMedia.findMany({
      where: {
        threads_id: { in: threadIdList },
        deleted_at: null
      },
      select: {
        id: true,
        threads_id: true,
        media_url: true,
        media_type: true,
        thumbnail_url: true
      }
    })
  ]);

  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const mediaMap = new Map<string, typeof media>();
  media.forEach((m) => {
    if (!mediaMap.has(m.threads_id)) {
      mediaMap.set(m.threads_id, []);
    }
    mediaMap.get(m.threads_id)!.push(m);
  });

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

  const reportsByThread = new Map<string, typeof allReports>();
  allReports.forEach((report) => {
    if (!reportsByThread.has(report.threads_id)) {
      reportsByThread.set(report.threads_id, []);
    }
    reportsByThread.get(report.threads_id)!.push(report);
  });

  let data = groupedReports.map((grouped) => {
    const thread = threadMap.get(grouped.threads_id);
    const content = thread?.content || 'Content not found';
    const threadReports = reportsByThread.get(grouped.threads_id) || [];

    let postDetails: Post | undefined;

    if (thread) {
      let type = 'default';
      if (thread.poll_id) type = 'poll';
      else if (thread.company_info_id) type = 'company_info';
      else if (thread.quoted_thread_id) type = 'quote';
      else if (thread.news_id) type = 'news';

      postDetails = {
        ...thread,
        type,
        user: userMap.get(thread.user_id) || {
          name: 'Unknown User',
          username: 'unknown',
          profile_pic: null
        },
        media: mediaMap.get(thread.id) || []
      };
    } else {
      // Fallback if thread not found, though it should be
      postDetails = {
        id: grouped.threads_id,
        user_id: 0,
        content: 'Content not found',
        visibility: 'public',
        created_at: new Date(),
        type: 'default',
        poll_id: null,
        company_info_id: null,
        quoted_thread_id: null,
        news_id: null,
        user: {
          name: 'Unknown',
          username: 'unknown',
          profile_pic: null
        }
      };
    }

    const uniqueReasonIds = Array.from(
      new Set(
        threadReports
          .map((r) => r.reason)
          .filter((reason): reason is string => !!reason)
      )
    );

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
        : '',
      postDetails
    };
  });

  if (isSortedInMem) {
    try {
      const parsedSort = JSON.parse(sort!);
      const { id: sortId, desc } = parsedSort[0];
      if (sortId === 'postTitle') {
        data.sort((a, b) => {
          return desc
            ? b.postTitle.localeCompare(a.postTitle)
            : a.postTitle.localeCompare(b.postTitle);
        });
      }
    } catch (e) {}
  }

  return { data, totalCount };
};
