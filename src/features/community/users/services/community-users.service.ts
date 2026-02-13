import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export interface CommunityUser {
  id: string; // user_id as string
  userName: string;
  username: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Unverified';
  date: string;
  accountStatus:
    | 'NORMAL'
    | 'WARNING'
    | 'LIMITED'
    | 'RESTRICTED'
    | 'SUSPENDED'
    | 'BANNED'
    | 'UNDER_REVIEW'
    | string
    | null;
  lastLogin: string | null;
  // Additional fields
  googleId: string | null;
  profilePic: string | null;
  updatedAt: string | null;
  stripeCustomerId: string | null;
  hasUsedTrial: boolean;
  trialUsedAt: string | null;
  bio: string | null;
  statusMessage: string | null;
  birthdate: string | null;
  languagePreference: string;
  themePreference: string | null;
  onboardingCompleted: boolean;
  activeWatchlistId: number | null;
  isPrivate: boolean;
  appleId: string | null;
}

export interface GetCommunityUsersParams {
  page?: number;
  pageSize?: number;
  userName?: string;
  username?: string; // New
  email?: string; // Existing
  search?: string;
  status?: string | string[]; // Verified status
  accountStatus?: string | string[]; // Account status
  from?: string; // Date range start
  to?: string; // Date range end
  sort?: string;
}

export async function getCommunityUsers(
  params: GetCommunityUsersParams = {}
): Promise<{
  data: CommunityUser[];
  totalCount: number;
  pageCount: number;
}> {
  const {
    page = 1,
    pageSize = 10,
    search,
    userName,
    username, // New param
    email,
    status,
    accountStatus,
    from,
    to,
    sort
  } = params;

  const where: any = {};
  const andConditions: any[] = [];

  // Name filter
  if (userName) {
    andConditions.push({ name: { contains: userName, mode: 'insensitive' } });
  }

  // Username filter
  if (username) {
    andConditions.push({
      username: { contains: username, mode: 'insensitive' }
    });
  }

  // Email filter
  if (email) {
    andConditions.push({ email: { contains: email, mode: 'insensitive' } });
  }

  // Generic Search fallback
  if (search && !userName && !email && !username) {
    const searchConditions: any[] = [
      { name: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { account_status: { contains: search, mode: 'insensitive' } }
    ];

    const dateSearch = new Date(search);
    const isValidDate = !isNaN(dateSearch.getTime()) && search.includes('-');

    if (isValidDate) {
      const nextDay = new Date(dateSearch);
      nextDay.setDate(dateSearch.getDate() + 1);
      searchConditions.push({
        created_at: {
          gte: dateSearch,
          lt: nextDay
        }
      });
    }

    andConditions.push({ OR: searchConditions });
  }

  // Verification Status filter
  if (status) {
    const statusArray = Array.isArray(status)
      ? status
      : typeof status === 'string'
        ? status.split(',')
        : [];

    if (statusArray.length > 0) {
      const includeVerified = statusArray.includes('Verified');
      const includeUnverified = statusArray.includes('Unverified');

      if (includeVerified && !includeUnverified) {
        andConditions.push({ is_verified: true });
      } else if (!includeVerified && includeUnverified) {
        andConditions.push({ is_verified: false });
      }
    }
  }

  // Account Status filter (Case Insensitive)
  if (accountStatus) {
    const statusArray = Array.isArray(accountStatus)
      ? accountStatus
      : typeof accountStatus === 'string'
        ? accountStatus.split(',')
        : [];

    if (statusArray.length > 0) {
      andConditions.push({
        OR: statusArray.map((s) => ({
          account_status: { equals: s, mode: 'insensitive' }
        }))
      });
    }
  }

  // Date Range filter
  if (from || to) {
    const dateFilter: any = {};
    if (from) {
      dateFilter.gte = new Date(from);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.lte = toDate;
    }
    andConditions.push({ created_at: dateFilter });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Sorting
  let orderBy: any = { user_id: 'desc' };

  const fieldMapping: Record<string, string> = {
    userName: 'name',
    accountStatus: 'account_status',
    lastLogin: 'last_login_at',
    date: 'created_at',
    createdAt: 'created_at',
    id: 'user_id'
  };

  if (sort) {
    try {
      const parsedSort = JSON.parse(sort);
      if (Array.isArray(parsedSort) && parsedSort.length > 0) {
        const { id, desc } = parsedSort[0];
        const dbField = fieldMapping[id] || id;
        orderBy = { [dbField]: desc ? 'desc' : 'asc' };
      }
    } catch (e) {
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
      : 'Unverified') as CommunityUser['status'],
    date: user.created_at
      ? format(new Date(user.created_at), 'yyyy-MM-dd')
      : 'N/A',
    accountStatus: user.account_status,
    lastLogin: user.last_login_at
      ? format(new Date(user.last_login_at), 'yyyy-MM-dd HH:mm')
      : 'N/A',
    googleId: user.google_id,
    profilePic: user.profile_pic,
    updatedAt: user.updated_at
      ? format(new Date(user.updated_at), 'yyyy-MM-dd HH:mm')
      : null,
    stripeCustomerId: user.stripe_customer_id,
    hasUsedTrial: user.has_used_trial,
    trialUsedAt: user.trial_used_at
      ? format(new Date(user.trial_used_at), 'yyyy-MM-dd HH:mm')
      : null,
    bio: user.bio,
    statusMessage: user.status_message,
    birthdate: user.birthdate
      ? format(new Date(user.birthdate), 'yyyy-MM-dd')
      : null,
    languagePreference: user.language_preference,
    themePreference: user.theme_preference,
    onboardingCompleted: user.onboarding_completed,
    activeWatchlistId: user.active_watchlist_id,
    isPrivate: user.is_private,
    appleId: user.apple_id
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function updateUserAccountStatus(userId: string, status: string) {
  return await prisma.users.update({
    where: { user_id: parseInt(userId) },
    data: { account_status: status }
  });
}
