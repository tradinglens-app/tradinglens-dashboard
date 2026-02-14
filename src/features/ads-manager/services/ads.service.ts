import { prisma } from '@/lib/prisma';
import { promotion_articles } from '@prisma/client';

export interface GetAdsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  title_en?: string;
  title_th?: string;
  description_en?: string;
  description_th?: string;
}

export type Ad = promotion_articles;

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
      orderBy: { id: 'desc' }
    }),
    prisma.promotion_articles.count({ where })
  ]);

  return {
    data: ads,
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
