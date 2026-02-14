import { prisma } from '@/lib/prisma';
import { getCheckConstraintValues } from '@/lib/db-enums.service';

export async function getAnnouncementEnumValues(): Promise<
  Record<string, string[]>
> {
  return getCheckConstraintValues('in_app_announcements');
}

export interface Announcement {
  id: number;
  type: string;
  display_type: string;
  title_en: string;
  title_th: string;
  message_en: string;
  message_th: string;
  button_text_en: string | null;
  button_text_th: string | null;
  action_type: string | null;
  action_value: string | null;
  platform: string | null;
  min_app_version: string | null;
  max_app_version: string | null;
  start_at: Date | null;
  end_at: Date | null;
  priority: number | null;
  is_active: boolean | null;
  dismissible: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface GetAnnouncementsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  title_en?: string;
  type?: string[];
  created_at_from?: string;
  created_at_to?: string;
}

export async function getAnnouncements(params: GetAnnouncementsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    title_en,
    type,
    created_at_from,
    created_at_to
  } = params;

  const where: any = { AND: [] };

  if (search) {
    where.AND.push({
      OR: [
        { title_en: { contains: search, mode: 'insensitive' } },
        { title_th: { contains: search, mode: 'insensitive' } },
        { message_en: { contains: search, mode: 'insensitive' } },
        { message_th: { contains: search, mode: 'insensitive' } }
      ]
    });
  }

  if (title_en) {
    where.AND.push({
      title_en: { contains: title_en, mode: 'insensitive' }
    });
  }

  if (type && type.length > 0) {
    where.AND.push({ type: { in: type } });
  }

  // Date range filter
  if (created_at_from || created_at_to) {
    const dateFilter: any = {};
    if (created_at_from) dateFilter.gte = new Date(created_at_from);
    if (created_at_to) {
      const toDate = new Date(created_at_to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.lte = toDate;
    }
    where.AND.push({ created_at: dateFilter });
  }

  if (where.AND.length === 0) delete where.AND;

  const [data, totalCount] = await Promise.all([
    prisma.in_app_announcements.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { id: 'desc' }
    }),
    prisma.in_app_announcements.count({ where })
  ]);

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function getAnnouncementById(id: number) {
  return prisma.in_app_announcements.findUnique({
    where: { id }
  });
}

export async function createAnnouncement(
  data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
) {
  return prisma.in_app_announcements.create({ data });
}

export async function updateAnnouncement(
  id: number,
  data: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>
) {
  return prisma.in_app_announcements.update({ where: { id }, data });
}

export async function deleteAnnouncement(id: number) {
  return prisma.in_app_announcements.delete({ where: { id } });
}
