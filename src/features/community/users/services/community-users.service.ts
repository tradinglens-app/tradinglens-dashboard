import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { getDistinctValues } from '@/lib/db-enums.service';

export async function getCommunityUserEnumValues(): Promise<
  Record<string, string[]>
> {
  const accountStatus = await getDistinctValues(
    'users',
    'account_status',
    'main'
  );
  return { accountStatus };
}

export interface CommunityUserSummary {
  id: string;
  userName: string;
  username: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Unverified';
  date: string;
  created_at: string;
  accountStatus: string | null;
  lastLogin: string | 'N/A';
  profilePic: string | null;
}

export interface CommunityUser extends CommunityUserSummary {
  googleId: string | null;
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
  username?: string;
  email?: string;
  search?: string;
  status?: string | string[];
  accountStatus?: string | string[];
  from?: string;
  to?: string;
  sort?: string;
}

export async function getCommunityUsers(
  params: GetCommunityUsersParams = {}
): Promise<{
  data: CommunityUserSummary[];
  totalCount: number;
  pageCount: number;
}> {
  const {
    page = 1,
    pageSize = 10,
    search,
    userName,
    username,
    email,
    status,
    accountStatus,
    from,
    to,
    sort
  } = params;

  // ... (keeping existing filter logic construction unchanged for brevity in this diff, assuming it remains same) ...
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
      if (statusArray.length === 1) {
        andConditions.push({
          account_status: { equals: statusArray[0], mode: 'insensitive' }
        });
      } else {
        andConditions.push({
          OR: statusArray.map((s) => ({
            account_status: { equals: s, mode: 'insensitive' }
          }))
        });
      }
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
    id: 'user_id',
    status: 'account_status'
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
      orderBy,
      select: {
        user_id: true,
        name: true,
        username: true,
        email: true,
        is_verified: true,
        created_at: true,
        account_status: true,
        last_login_at: true,
        profile_pic: true
        // Exclude heavy/unused fields for list view
      }
    }),
    prisma.users.count({ where })
  ]);

  const data: CommunityUserSummary[] = users.map((user) => ({
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
    created_at: user.created_at ? user.created_at.toISOString() : '',
    accountStatus: user.account_status,
    lastLogin: user.last_login_at
      ? format(new Date(user.last_login_at), 'yyyy-MM-dd HH:mm')
      : 'N/A',
    profilePic: user.profile_pic
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function getCommunityUserById(
  userId: string
): Promise<CommunityUser | null> {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) }
  });

  if (!user) return null;

  return {
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
    created_at: user.created_at ? user.created_at.toISOString() : '',
    accountStatus: user.account_status,
    lastLogin: user.last_login_at
      ? format(new Date(user.last_login_at), 'yyyy-MM-dd HH:mm')
      : 'N/A',
    profilePic: user.profile_pic,
    googleId: user.google_id,
    updatedAt: user.updated_at
      ? format(new Date(user.updated_at), 'yyyy-MM-dd HH:mm')
      : null,
    stripeCustomerId: user.stripe_customer_id,
    hasUsedTrial: user.has_used_trial || false,
    trialUsedAt: user.trial_used_at
      ? format(new Date(user.trial_used_at), 'yyyy-MM-dd HH:mm')
      : null,
    bio: user.bio,
    statusMessage: user.status_message,
    birthdate: user.birthdate
      ? format(new Date(user.birthdate), 'yyyy-MM-dd')
      : null,
    languagePreference: user.language_preference || 'en',
    themePreference: user.theme_preference,
    onboardingCompleted: user.onboarding_completed || false,
    activeWatchlistId: user.active_watchlist_id,
    isPrivate: user.is_private || false,
    appleId: user.apple_id
  };
}

export async function updateUserAccountStatus(userId: string, status: string) {
  return await prisma.users.update({
    where: { user_id: parseInt(userId) },
    data: { account_status: status }
  });
}
