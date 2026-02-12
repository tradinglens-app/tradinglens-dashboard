import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export interface VerificationRequest {
  id: string;
  userName: string;
  username: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  date: string;
  accountStatus: string | null;
  lastLogin: string | null;
}
export interface GetVerificationRequestsParams {
  page?: number;
  pageSize?: number;
  userName?: string;
  email?: string;
  search?: string;
  status?: string | string[];
  sort?: string; // Format: "column.order" or JSON array
}

export async function getVerificationRequests(
  params: GetVerificationRequestsParams = {}
): Promise<{
  data: VerificationRequest[];
  totalCount: number;
  pageCount: number;
}> {
  const {
    page = 1,
    pageSize = 10,
    search,
    userName,
    email,
    status,
    sort
  } = params;

  // Filters
  const where: any = {};

  // Name filter
  if (userName) {
    where.name = { contains: userName, mode: 'insensitive' };
  }

  // Email filter
  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  // Generic Search fallback
  if (search && !userName && !email) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Status filter (faceted)
  if (status) {
    const statusArray = Array.isArray(status)
      ? status
      : typeof status === 'string'
        ? status.split(',')
        : [];

    if (statusArray.length > 0) {
      const includeVerified = statusArray.includes('Verified');
      const includePending = statusArray.includes('Pending');

      if (includeVerified && !includePending) {
        where.is_verified = true;
      } else if (!includeVerified && includePending) {
        where.is_verified = false;
      }
      // If both or none, we don't apply a filter on is_verified
    }
  }

  // Sorting
  let orderBy: any = { user_id: 'desc' };

  const fieldMapping: Record<string, string> = {
    userName: 'name',
    accountStatus: 'account_status',
    lastLogin: 'last_login_at',
    date: 'created_at',
    id: 'user_id'
  };

  if (sort) {
    try {
      // Try parsing as JSON first (standard for useDataTable)
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        const { id, desc } = parsedSort[0];
        const dbField = fieldMapping[id] || id;
        orderBy = { [dbField]: desc ? 'desc' : 'asc' };
      }
    } catch (e) {
      // Fallback to dot notation
      const [column, order] = sort.split('.');
      if (column && order) {
        const dbField = fieldMapping[column] || column;
        orderBy = {
          [dbField]: order.toLowerCase() === 'desc' ? 'desc' : 'asc'
        };
      }
    }
  }

  const [users, totalCount] = await Promise.all([
    prisma.users.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy
    }),
    prisma.users.count({ where })
  ]);
  const data = users.map((user) => ({
    id: user.user_id.toString(),
    userName: user.name || 'N/A',
    username: user.username || 'N/A',
    email: user.email || 'N/A',
    status: (user.is_verified
      ? 'Verified'
      : 'Pending') as VerificationRequest['status'],
    date: user.created_at
      ? format(new Date(user.created_at), 'yyyy-MM-dd')
      : 'N/A',
    accountStatus: user.account_status,
    lastLogin: user.last_login_at
      ? format(new Date(user.last_login_at), 'yyyy-MM-dd HH:mm')
      : 'N/A'
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}
