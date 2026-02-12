import { prisma } from '@/lib/prisma';

export interface NewsArticle {
  id: string;
  symbol: string;
  exchange: string | null;
  title: string;
  content: string | null;
  summary: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  publisher: string | null;
  publishedDate: Date;
  language: string | null;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isFeatured: boolean;
  isHot: boolean;
  isActive: boolean;
  tags: string[];
  categories: any;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GetNewsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  symbol?: string;
  language?: string;
  publisher?: string;
  from?: Date;
  to?: Date;
  isFeatured?: boolean;
  isHot?: boolean;
  isActive?: boolean;
  sort?: string;
}

export async function getNews(params: GetNewsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    symbol,
    language,
    publisher,
    from,
    to,
    isFeatured,
    isHot,
    isActive,
    sort
  } = params;

  const where: any = {};

  // Active filter - only apply if explicitly provided
  if (isActive !== undefined) {
    where.is_active = isActive;
  }

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { summary: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Symbol filter
  if (symbol) {
    where.symbol = { contains: symbol, mode: 'insensitive' };
  }

  // Publisher filter
  if (publisher) {
    where.publisher = { contains: publisher, mode: 'insensitive' };
  }

  // Date range filter (Created At)
  if (from || to) {
    where.created_at = {};
    if (from) {
      where.created_at.gte = from;
    }
    if (to) {
      where.created_at.lte = to;
    }
  }

  // Language filter
  if (language) {
    where.language = language;
  }

  // Featured filter
  if (isFeatured !== undefined) {
    where.is_featured = isFeatured;
  }

  // Hot filter
  if (isHot !== undefined) {
    where.is_hot = isHot;
  }

  // Sorting
  let orderBy: any = { created_at: 'desc' };

  if (sort) {
    try {
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        const { id, desc } = parsedSort[0];
        const fieldMapping: Record<string, string> = {
          title: 'title',
          publishedDate: 'published_date',
          viewCount: 'view_count',
          likeCount: 'like_count',
          createdAt: 'created_at',
          isFeatured: 'is_featured',
          isHot: 'is_hot',
          isActive: 'is_active'
        };
        const dbField = fieldMapping[id] || id;
        orderBy = { [dbField]: desc ? 'desc' : 'asc' };
      }
    } catch (e) {
      // Keep default sorting
    }
  }

  const [news, totalCount] = await Promise.all([
    prisma.stock_news.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy
    }),
    prisma.stock_news.count({ where })
  ]);

  const data: NewsArticle[] = news.map((n) => ({
    id: n.id,
    symbol: n.symbol,
    exchange: n.exchange,
    title: n.title,
    content: n.content,
    summary: n.summary,
    imageUrl: n.image_url,
    sourceUrl: n.source_url,
    publisher: n.publisher,
    publishedDate: n.published_date,
    language: n.language,
    viewCount: n.view_count ?? 0,
    likeCount: n.like_count ?? 0,
    shareCount: n.share_count ?? 0,
    isFeatured: n.is_featured ?? false,
    isHot: n.is_hot ?? false,
    isActive: n.is_active ?? true,
    tags: n.tags,
    categories: n.categories,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function getNewsById(id: string) {
  const news = await prisma.stock_news.findUnique({
    where: { id }
  });

  if (!news) return null;

  return {
    id: news.id,
    symbol: news.symbol,
    exchange: news.exchange,
    title: news.title,
    content: news.content,
    summary: news.summary,
    imageUrl: news.image_url,
    sourceUrl: news.source_url,
    publisher: news.publisher,
    publishedDate: news.published_date,
    language: news.language,
    viewCount: news.view_count ?? 0,
    likeCount: news.like_count ?? 0,
    shareCount: news.share_count ?? 0,
    isFeatured: news.is_featured ?? false,
    isHot: news.is_hot ?? false,
    isActive: news.is_active ?? true,
    tags: news.tags,
    categories: news.categories,
    createdAt: news.created_at,
    updatedAt: news.updated_at
  };
}

export async function createNews(data: Partial<NewsArticle>) {
  if (!data.symbol || !data.title) {
    throw new Error('Symbol and title are required');
  }

  return prisma.stock_news.create({
    data: {
      symbol: data.symbol,
      exchange: data.exchange,
      title: data.title,
      content: data.content,
      summary: data.summary,
      image_url: data.imageUrl,
      source_url: data.sourceUrl,
      publisher: data.publisher,
      published_date: data.publishedDate || new Date(),
      language: data.language || 'en',
      is_featured: data.isFeatured ?? false,
      is_hot: data.isHot ?? false,
      is_active: data.isActive ?? true,
      tags: data.tags || [],
      categories: data.categories
    }
  });
}

export async function updateNews(id: string, data: Partial<NewsArticle>) {
  return prisma.stock_news.update({
    where: { id },
    data: {
      symbol: data.symbol,
      exchange: data.exchange,
      title: data.title,
      content: data.content,
      summary: data.summary,
      image_url: data.imageUrl,
      source_url: data.sourceUrl,
      publisher: data.publisher,
      published_date: data.publishedDate,
      language: data.language,
      is_featured: data.isFeatured,
      is_hot: data.isHot,
      is_active: data.isActive,
      tags: data.tags,
      categories: data.categories,
      updated_at: new Date()
    }
  });
}

export async function toggleNewsActive(id: string, isActive: boolean) {
  return prisma.stock_news.update({
    where: { id },
    data: {
      is_active: isActive,
      updated_at: new Date()
    }
  });
}

export async function deleteNews(id: string) {
  return prisma.stock_news.delete({
    where: { id }
  });
}
