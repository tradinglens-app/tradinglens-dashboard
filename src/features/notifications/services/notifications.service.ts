import { prisma } from '@/lib/prisma';
import { prismaThread } from '@/lib/prisma-thread';
import { getEnumValues } from '@/lib/db-enums.service';

export async function getNotificationEnumValues(): Promise<
  Record<string, string[]>
> {
  const type = await getEnumValues('notification_type_enum', 'thread');
  return { type };
}

export interface Notification {
  id: string;
  user_id: number | null;
  sender_id: number | null;
  message_th: string | null;
  message_en: string | null;
  metadata: any;
  is_read: boolean | null;
  type: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  sender?: {
    name: string | null;
    username: string | null;
    profile_pic: string | null;
  };
  recipient?: {
    name: string | null;
    username: string | null;
    profile_pic: string | null;
  };
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string[];
  is_read?: string[];
  created_at_from?: string;
  created_at_to?: string;
}

export async function getNotifications(params: GetNotificationsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    type,
    is_read,
    created_at_from,
    created_at_to
  } = params;

  const where: any = {
    deleted_at: null
  };

  if (search) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        search
      );

    where.OR = [
      { message_en: { contains: search, mode: 'insensitive' } },
      { message_th: { contains: search, mode: 'insensitive' } }
    ];

    if (isUuid) {
      where.OR.push({ id: search });
    }
  }

  if (type && type.length > 0) {
    where.type = { in: type };
  }

  if (is_read && is_read.length > 0) {
    if (is_read.includes('true') && !is_read.includes('false')) {
      where.is_read = true;
    } else if (is_read.includes('false') && !is_read.includes('true')) {
      where.is_read = false;
    }
  }

  if (created_at_from || created_at_to) {
    const dateFilter: any = {};
    if (created_at_from) dateFilter.gte = new Date(created_at_from);
    if (created_at_to) {
      const toDate = new Date(created_at_to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.lte = toDate;
    }
    where.created_at = dateFilter;
  }

  const [notifications, totalCount] = await Promise.all([
    prismaThread.notifications.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' }
    }),
    prismaThread.notifications.count({ where })
  ]);

  // Join sender and recipient info from main DB
  const userIds = Array.from(
    new Set([
      ...notifications
        .map((n) => n.sender_id)
        .filter((id): id is number => id !== null),
      ...notifications
        .map((n) => n.user_id)
        .filter((id): id is number => id !== null)
    ])
  );

  const users =
    userIds.length > 0
      ? await prisma.users.findMany({
          where: { user_id: { in: userIds } },
          select: {
            user_id: true,
            name: true,
            username: true,
            profile_pic: true
          }
        })
      : [];

  const userMap = new Map(users.map((u) => [u.user_id, u]));

  const data: Notification[] = notifications.map((n) => ({
    ...n,
    id: n.id,
    type: n.type as string | null,
    sender: n.sender_id
      ? userMap.get(n.sender_id) || {
          name: 'Unknown',
          username: 'unknown',
          profile_pic: null
        }
      : undefined,
    recipient: n.user_id
      ? userMap.get(n.user_id) || {
          name: 'Unknown',
          username: 'unknown',
          profile_pic: null
        }
      : undefined
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
