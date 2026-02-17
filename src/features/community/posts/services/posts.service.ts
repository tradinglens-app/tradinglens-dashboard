import { prisma as prismaMain } from '@/lib/prisma';
import { prismaThread } from '@/lib/prisma-thread';
import { getEnumValues } from '@/lib/db-enums.service';

export async function getPostEnumValues(): Promise<Record<string, string[]>> {
  const visibility = await getEnumValues('visibility_enum', 'thread');
  const type = ['default', 'poll', 'company_info', 'quote', 'news'];
  return { visibility, type };
}

export interface Post {
  id: string;
  user_id: number;
  content: string | null;
  visibility: string | null;
  created_at: Date;
  updated_at?: Date;
  poll_id: string | null;
  company_info_id: string | null;
  quoted_thread_id: string | null;
  news_id: string | null;
  start_thread_id?: string | null;
  parent_thread_id?: string | null;
  parent_level?: number;
  user?: {
    name: string | null;
    username: string | null;
    profile_pic: string | null;
  };
  type: string;
  media?: Array<{
    id: string;
    media_url: string | null;
    media_type: string | null;
    thumbnail_url: string | null;
  }>;
  poll?: {
    id: string;
    question: string;
    total_voted: number;
    expires_at: Date;
    options: Array<{
      id: string;
      option_text: string;
      voted_count: number;
    }>;
  } | null;
  metrics?: {
    viewed_count: number;
    replied_count: number;
    reposted_count: number;
    quoted_count: number;
    liked_count: number;
    reported_count: number;
  } | null;
  hashtags?: string[];
  symbols?: string[];
  mentions?: Array<{
    user_id: number;
    name: string | null;
    username: string | null;
  }>;
  companyInfo?: {
    symbol: string;
    name: string;
    market_state: string;
    regular_market_price: number;
    regular_market_change: number;
    regular_market_change_percent: number;
    sector: string;
    industry: string;
    exchange_name: string | null;
    currency: string;
  } | null;
}

export interface GetPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  id?: string;
  created_at?: number[];
  visibility?: string[];
  type?: string[];
  sort?: string;
}

export async function getPosts(params: GetPostsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    id,
    created_at,
    visibility,
    type,
    sort
  } = params;

  const where: any = {
    deleted_at: null,
    parent_thread_id: null
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

  if (type && type.length > 0) {
    const typeConditions = [];

    if (type.includes('poll')) {
      typeConditions.push({ poll_id: { not: null } });
    }
    if (type.includes('company_info')) {
      typeConditions.push({ company_info_id: { not: null } });
    }
    if (type.includes('quote')) {
      typeConditions.push({ quoted_thread_id: { not: null } });
    }
    if (type.includes('news')) {
      typeConditions.push({ news_id: { not: null } });
    }
    if (type.includes('default')) {
      typeConditions.push({
        AND: [
          { poll_id: null },
          { company_info_id: null },
          { quoted_thread_id: null },
          { news_id: null }
        ]
      });
    }

    if (typeConditions.length > 0) {
      where.OR = typeConditions;
    }
  }

  let orderBy: any = { created_at: 'desc' };
  if (sort) {
    try {
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        let { id, desc } = parsedSort[0];
        if (id === 'createdAt') id = 'created_at';
        orderBy = { [id]: desc ? 'desc' : 'asc' };
      }
    } catch (e) {
      console.error('Error parsing sort:', e);
    }
  }

  const [threads, totalCount] = await Promise.all([
    prismaThread.threads.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy,
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
        parent_level: true
      }
    }),
    prismaThread.threads.count({ where })
  ]);

  const threadIds = threads.map((t) => t.id);
  const media = await prismaThread.threadMedia.findMany({
    where: {
      threads_id: { in: threadIds },
      deleted_at: null
    },
    select: {
      id: true,
      threads_id: true,
      media_url: true,
      media_type: true,
      thumbnail_url: true
    }
  });

  const mediaMap = new Map<string, typeof media>();
  media.forEach((m) => {
    if (!mediaMap.has(m.threads_id)) {
      mediaMap.set(m.threads_id, []);
    }
    mediaMap.get(m.threads_id)!.push(m);
  });

  const userIds = Array.from(new Set(threads.map((t) => t.user_id)));

  const users: Array<{
    user_id: number;
    name: string;
    username: string;
    profile_pic: string | null;
  }> = await prismaMain.users.findMany({
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

  // Map Users to Threads
  const userMap = new Map(users.map((u) => [u.user_id, u]));

  // Fetch Polls if any
  const polls = await prismaThread.threadPolls.findMany({
    where: {
      threads_id: { in: threadIds },
      deleted_at: null
    }
  });

  const pollIds = polls.map((p) => p.id);
  const pollOptions = await prismaThread.threadPollOptions.findMany({
    where: {
      poll_id: { in: pollIds },
      deleted_at: null
    }
  });

  const pollOptionsMap = new Map<string, typeof pollOptions>();
  pollOptions.forEach((opt) => {
    if (!pollOptionsMap.has(opt.poll_id)) {
      pollOptionsMap.set(opt.poll_id, []);
    }
    pollOptionsMap.get(opt.poll_id)!.push(opt);
  });

  const pollMap = new Map<string, any>();
  polls.forEach((p) => {
    pollMap.set(p.threads_id, {
      ...p,
      options: pollOptionsMap.get(p.id) || []
    });
  });

  // Fetch Metrics, Hashtags, Mentions, and Company Info
  const [
    engagementMetrics,
    threadHashtags,
    threadMentions,
    threadCompaniesInfo
  ] = await Promise.all([
    prismaThread.threadEngagementMetrics.findMany({
      where: { threads_id: { in: threadIds }, deleted_at: null }
    }),
    prismaThread.threadHashtags.findMany({
      where: { threads_id: { in: threadIds }, deleted_at: null }
    }),
    prismaThread.threadMentions.findMany({
      where: { threads_id: { in: threadIds }, deleted_at: null }
    }),
    prismaThread.companiesInfo.findMany({
      where: { threads_id: { in: threadIds }, deleted_at: null }
    })
  ]);

  const companyInfoMap = new Map(
    threadCompaniesInfo.map((c) => [
      c.threads_id,
      {
        symbol: c.symbol,
        name: c.name,
        market_state: c.market_state,
        regular_market_price: c.regular_market_price,
        regular_market_change: c.regular_market_change,
        regular_market_change_percent: c.regular_market_change_percent,
        sector: c.sector,
        industry: c.industry,
        exchange_name: c.exchange_name,
        currency: c.currency
      }
    ])
  );

  const metricsMap = new Map(
    engagementMetrics.map((m) => [
      m.threads_id,
      {
        viewed_count: Number(m.viewed_count),
        replied_count: m.replied_count,
        reposted_count: m.reposted_count,
        quoted_count: m.quoted_count,
        liked_count: m.liked_count,
        reported_count: m.reported_count
      }
    ])
  );

  const hashtagMap = new Map<string, string[]>();
  const symbolMap = new Map<string, string[]>();
  threadHashtags.forEach((h) => {
    if (h.type === 'hashtag') {
      if (!hashtagMap.has(h.threads_id)) hashtagMap.set(h.threads_id, []);
      hashtagMap.get(h.threads_id)!.push(h.tag);
    } else if (h.type === 'symbol') {
      if (!symbolMap.has(h.threads_id)) symbolMap.set(h.threads_id, []);
      symbolMap.get(h.threads_id)!.push(h.tag);
    }
  });

  const mentionedUserIds = Array.from(
    new Set(threadMentions.map((m) => m.mentioned_user_id))
  );
  const mentionedUsers = await prismaMain.users.findMany({
    where: { user_id: { in: mentionedUserIds } },
    select: { user_id: true, name: true, username: true }
  });
  const mentionedUserMap = new Map(mentionedUsers.map((u) => [u.user_id, u]));

  const mentionMap = new Map<string, any[]>();
  threadMentions.forEach((m) => {
    if (!mentionMap.has(m.threads_id)) mentionMap.set(m.threads_id, []);
    const userData = mentionedUserMap.get(m.mentioned_user_id);
    if (userData) {
      mentionMap.get(m.threads_id)!.push(userData);
    }
  });

  const data: Post[] = threads.map((thread) => {
    let type = 'default';
    if (thread.poll_id) type = 'poll';
    else if (thread.company_info_id) type = 'company_info';
    else if (thread.quoted_thread_id) type = 'quote';
    else if (thread.news_id) type = 'news';

    return {
      ...thread,
      type,
      user: userMap.get(thread.user_id) || {
        name: 'Unknown User',
        username: 'unknown',
        profile_pic: null
      },
      media: mediaMap.get(thread.id) || [],
      poll: pollMap.get(thread.id) || null,
      metrics: metricsMap.get(thread.id) || null,
      hashtags: hashtagMap.get(thread.id) || [],
      symbols: symbolMap.get(thread.id) || [],
      mentions: mentionMap.get(thread.id) || [],
      companyInfo: companyInfoMap.get(thread.id) || null
    };
  });

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
