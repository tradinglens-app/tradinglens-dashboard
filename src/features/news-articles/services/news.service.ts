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
  translations?: {
    id: string;
    language: string;
    title: string;
    content: string | null;
    summary: string | null;
  }[];
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
  hasImage?: boolean;
  showDuplicates?: string[];
  publishedFrom?: Date;
  publishedTo?: Date;
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
    sort,
    hasImage,
    publishedFrom,
    publishedTo
  } = params;

  const where: any = {};

  // Active filter - only apply if explicitly provided
  if (isActive !== undefined) {
    where.is_active = isActive;
  }

  // Search filter
  if (search) {
    const terms = search.trim().split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      where.AND = [
        ...(where.AND || []),
        ...terms.map((term) => ({
          title: { contains: term, mode: 'insensitive' }
        }))
      ];
    }
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

  // Published date range filter
  if (publishedFrom || publishedTo) {
    where.published_date = {};
    if (publishedFrom) {
      where.published_date.gte = publishedFrom;
    }
    if (publishedTo) {
      where.published_date.lte = publishedTo;
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

  // Has Image filter
  if (hasImage !== undefined) {
    if (hasImage) {
      where.AND = [
        ...(where.AND || []),
        { image_url: { not: null } },
        { image_url: { not: '' } }
      ];
    } else {
      // Logic for hasImage = false: Image is null OR empty
      const imageMissingCondition = {
        OR: [{ image_url: null }, { image_url: '' }]
      };

      // If we already have OR conditions (from search), we must AND them with this new condition
      // However, Prisma structure for AND is: AND: [ { OR: [...] }, { OR: [...] } ]
      if (where.OR && where.OR.length > 0) {
        // Move existing OR to an AND group
        where.AND = [
          ...(where.AND || []),
          { OR: where.OR },
          imageMissingCondition
        ];
        delete where.OR;
      } else {
        where.OR = [{ image_url: null }, { image_url: '' }];
      }
    }
  }

  // Duplicate filter
  if (params.showDuplicates && params.showDuplicates.length > 0) {
    const duplicateConditions: any[] = [];

    if (params.showDuplicates.includes('title')) {
      const duplicates = await prisma.stock_news.groupBy({
        by: ['title'],
        having: {
          title: {
            _count: {
              gt: 1
            }
          }
        }
      });
      const titles = duplicates.map((d) => d.title);
      duplicateConditions.push({ title: { in: titles } });
    }

    if (params.showDuplicates.includes('url')) {
      const duplicates = await prisma.stock_news.groupBy({
        by: ['source_url'],
        where: {
          source_url: { not: null }
        },
        having: {
          source_url: {
            _count: {
              gt: 1
            }
          }
        }
      });
      const urls = duplicates
        .map((d) => d.source_url)
        .filter((url): url is string => url !== null);
      duplicateConditions.push({ source_url: { in: urls } });
    }

    if (duplicateConditions.length > 0) {
      if (duplicateConditions.length === 1) {
        // Single condition - merge into where
        Object.assign(where, duplicateConditions[0]);
      } else {
        // Multiple conditions - use OR to show articles that match either type of duplicate
        where.AND = [...(where.AND || []), { OR: duplicateConditions }];
      }
    }
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
          isActive: 'is_active',
          symbol: 'symbol',
          publisher: 'publisher'
        };
        const dbField = fieldMapping[id] || id;
        orderBy = { [dbField]: desc ? 'desc' : 'asc' };
      }
    } catch (e) {
      // Keep default sorting
    }
  } else if (params.showDuplicates && params.showDuplicates.length > 0) {
    // Default sorting for duplicate view to group them together
    if (params.showDuplicates.includes('title')) {
      orderBy = [{ title: 'asc' }, { created_at: 'desc' }];
    } else if (params.showDuplicates.includes('url')) {
      orderBy = [{ source_url: 'asc' }, { created_at: 'desc' }];
    }
  }

  const [news, totalCount] = await Promise.all([
    prisma.stock_news.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy,
      select: {
        id: true,
        symbol: true,
        title: true,
        summary: true,
        image_url: true,
        publisher: true,
        published_date: true,
        language: true,
        is_featured: true,
        is_hot: true,
        is_active: true,
        created_at: true
        // Exclude: content, source_url, share_count, tags, categories, updated_at, exchange, view_count, like_count, translations
        // Exclude: content, source_url, share_count, tags, categories, updated_at
      }
    }),
    prisma.stock_news.count({ where })
  ]);

  const data: NewsArticle[] = news.map((n) => ({
    id: n.id,
    symbol: n.symbol,
    exchange: null, // Excluded from list query
    title: n.title,
    content: null, // Excluded from list query
    summary: n.summary,
    imageUrl: n.image_url,
    sourceUrl: null, // Excluded from list query
    publisher: n.publisher,
    publishedDate: n.published_date,
    language: n.language,
    viewCount: 0, // Excluded from list query
    likeCount: 0, // Excluded from list query
    shareCount: 0, // Excluded from list query
    isFeatured: n.is_featured ?? false,
    isHot: n.is_hot ?? false,
    isActive: n.is_active ?? true,
    tags: [], // Excluded from list query
    categories: null, // Excluded from list query
    translations: [], // Excluded from list query
    createdAt: n.created_at,
    updatedAt: null // Excluded from list query
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function getNewsById(id: string) {
  const news = await prisma.stock_news.findUnique({
    where: { id },
    include: {
      stock_news_translation: true
    }
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
    translations: news.stock_news_translation.map((t) => ({
      id: t.id,
      language: t.language,
      title: t.title,
      content: t.content,
      summary: t.summary
    })),
    createdAt: news.created_at,
    updatedAt: news.updated_at
  };
}

export type CreateNewsInput = Omit<Partial<NewsArticle>, 'translations'> & {
  translations?: {
    language: string;
    title: string;
    content?: string;
    summary?: string;
  }[];
};

export async function createNews(data: CreateNewsInput) {
  if (!data.symbol || !data.title) {
    throw new Error('Symbol and title are required');
  }

  const news = await prisma.stock_news.create({
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

  if (data.translations && data.translations.length > 0) {
    await Promise.all(
      data.translations.map((t) =>
        prisma.stock_news_translation.create({
          data: {
            news_id: news.id,
            language: t.language,
            title: t.title,
            content: t.content,
            summary: t.summary
          }
        })
      )
    );
  }

  return news;
}

export async function updateNews(id: string, data: CreateNewsInput) {
  const news = await prisma.stock_news.update({
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

  if (data.translations && data.translations.length > 0) {
    await Promise.all(
      data.translations.map(async (t) => {
        const existing = await prisma.stock_news_translation.findFirst({
          where: {
            news_id: id,
            language: t.language
          }
        });

        if (existing) {
          return prisma.stock_news_translation.update({
            where: { id: existing.id },
            data: {
              title: t.title,
              content: t.content,
              summary: t.summary,
              updated_at: new Date()
            }
          });
        } else {
          return prisma.stock_news_translation.create({
            data: {
              news_id: id,
              language: t.language,
              title: t.title,
              content: t.content,
              summary: t.summary
            }
          });
        }
      })
    );
  }

  return news;
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

export async function deleteManyNews(ids: string[]) {
  return prisma.stock_news.deleteMany({
    where: {
      id: { in: ids }
    }
  });
}

export async function invalidateNewsImage(id: string) {
  return prisma.stock_news.update({
    where: { id },
    data: {
      image_url: null,
      updated_at: new Date()
    }
  });
}

export async function updateManyNews(
  ids: string[],
  data: Partial<NewsArticle>
) {
  // Filter out undefined values to avoid overwriting with null/undefined
  const updateData: any = {};
  if (data.isActive !== undefined) updateData.is_active = data.isActive;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.sourceUrl !== undefined) updateData.source_url = data.sourceUrl;
  // Add other fields here as needed, e.g. isFeatured, isHot

  if (Object.keys(updateData).length === 0) return { count: 0 };

  return prisma.stock_news.updateMany({
    where: {
      id: { in: ids }
    },
    data: {
      ...updateData,
      updated_at: new Date()
    }
  });
}
