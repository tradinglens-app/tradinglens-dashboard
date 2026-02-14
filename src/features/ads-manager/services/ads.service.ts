import { prisma } from '@/lib/prisma';

export interface Ad {
  id: number;
  image_banner_dark: string | null;
  image_banner_white: string | null;
  title_th: string | null;
  title_en: string | null;
  description_th: string | null;
  description_en: string | null;
  content_th: string | null;
  content_en: string | null;
  button_text_th: string | null;
  button_text_en: string | null;
  path: string | null;
  type: string | null;
}

export interface GetAdsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  title_en?: string;
  title_th?: string;
  description_en?: string;
  description_th?: string;
}

export async function getAds(params: GetAdsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    title_en,
    title_th,
    description_en,
    description_th
  } = params;

  const where: any = { AND: [] };

  if (search) {
    where.AND.push({
      OR: [
        { title_en: { contains: search, mode: 'insensitive' } },
        { title_th: { contains: search, mode: 'insensitive' } },
        { description_en: { contains: search, mode: 'insensitive' } },
        { description_th: { contains: search, mode: 'insensitive' } }
      ]
    });
  }

  if (title_en) {
    where.AND.push({ title_en: { contains: title_en, mode: 'insensitive' } });
  }

  if (title_th) {
    where.AND.push({ title_th: { contains: title_th, mode: 'insensitive' } });
  }

  if (description_en) {
    where.AND.push({
      description_en: { contains: description_en, mode: 'insensitive' }
    });
  }

  if (description_th) {
    where.AND.push({
      description_th: { contains: description_th, mode: 'insensitive' }
    });
  }

  // Clean up empty AND
  if (where.AND.length === 0) delete where.AND;

  const [ads, totalCount] = await Promise.all([
    prisma.promotion_articles.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        title_en: true,
        title_th: true,
        description_en: true,
        description_th: true,
        type: true,
        image_banner_dark: true,
        image_banner_white: true,
        path: true
        // Exclude content and button text if not needed in list
      }
    }),
    prisma.promotion_articles.count({ where })
  ]);

  const data: Ad[] = ads.map((ad) => ({
    id: ad.id,
    image_banner_dark: ad.image_banner_dark,
    image_banner_white: ad.image_banner_white,
    title_th: ad.title_th,
    title_en: ad.title_en,
    description_th: ad.description_th,
    description_en: ad.description_en,
    content_th: null, // Excluded
    content_en: null, // Excluded
    button_text_th: null, // Excluded
    button_text_en: null, // Excluded
    path: ad.path,
    type: ad.type
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function getAdById(id: number) {
  return prisma.promotion_articles.findUnique({
    where: { id }
  });
}

export async function createAd(data: Omit<Ad, 'id'>) {
  return prisma.promotion_articles.create({
    data
  });
}

export async function updateAd(id: number, data: Partial<Omit<Ad, 'id'>>) {
  return prisma.promotion_articles.update({
    where: { id },
    data
  });
}

export async function deleteAd(id: number) {
  return prisma.promotion_articles.delete({
    where: { id }
  });
}
