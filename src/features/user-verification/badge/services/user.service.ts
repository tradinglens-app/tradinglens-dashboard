import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export interface VerificationRequest {
  id: string;
  userName: string;
  username: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Unverified';
  date: string;
  created_at: string;
  accountStatus: string | null;
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

export interface GetVerificationRequestsParams {
  page?: number;
  pageSize?: number;
  userName?: string;
  username?: string;
  email?: string;
  search?: string;
  status?: string | string[];
  from?: string;
  to?: string;
  sort?: string; // Format: "column.order" or JSON array
}

export async function getVerificationRequests(
  params: GetVerificationRequestsParams = {}
): Promise<{
  data: VerificationRequest[];
  totalCount: number;
  pageCount: number;
}> {
  // ... (params destructuring and where clause logic remains same) ...

  const {
    page = 1,
    pageSize = 10,
    search,
    userName,
    username,
    email,
    status,
    from,
    to,
    sort
  } = params;

  // Filters
  const where: any = {};

  // Name filter
  if (userName) {
    where.name = { contains: userName, mode: 'insensitive' };
  }

  // Username filter
  if (username) {
    where.username = { contains: username, mode: 'insensitive' };
  }

  // Email filter
  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  // Date range filter
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at.gte = new Date(from);
    if (to) where.created_at.lte = new Date(to);
  }

  // Generic Search fallback
  if (search && !userName && !username && !email) {
    const searchConditions: any[] = [
      { name: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];

    // Add status search
    const searchLower = search.toLowerCase();
    if (
      searchLower.includes('verified') ||
      searchLower.includes('unverified')
    ) {
      if (searchLower.includes('unverified')) {
        searchConditions.push({ is_verified: false });
      } else if (searchLower === 'verified') {
        searchConditions.push({ is_verified: true });
      }
    } else if (searchLower.includes('pending')) {
      searchConditions.push({ is_verified: false });
    }

    where.OR = searchConditions;
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
      const includeUnverified = statusArray.includes('Unverified');

      if (includeVerified && !includePending && !includeUnverified) {
        where.is_verified = true;
      } else if (!includeVerified && includePending && !includeUnverified) {
        // For now, Pending is same as Unverified (is_verified = false)
        // You can add additional logic here if you have a separate pending field
        where.is_verified = false;
      } else if (!includeVerified && !includePending && includeUnverified) {
        where.is_verified = false;
      } else if (includeVerified && includePending && !includeUnverified) {
        // Verified OR Pending (true OR false) - no filter needed
      } else if (includeVerified && !includePending && includeUnverified) {
        // Verified OR Unverified - no practical filter
      } else if (!includeVerified && includePending && includeUnverified) {
        // Pending OR Unverified - both are false
        where.is_verified = false;
      }
      // If all three are selected, no filter is applied
    }
  }

  // Sorting
  let orderBy: any = { user_id: 'desc' };

  const fieldMapping: Record<string, string> = {
    userName: 'name',
    accountStatus: 'account_status',
    lastLogin: 'last_login_at',
    date: 'created_at',
    created_at: 'created_at',
    createdAt: 'created_at',
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
      : 'Unverified') as VerificationRequest['status'],
    date: user.created_at
      ? format(new Date(user.created_at), 'yyyy-MM-dd')
      : 'N/A',
    created_at: user.created_at ? user.created_at.toISOString() : '',
    accountStatus: user.account_status,
    lastLogin: user.last_login_at
      ? format(new Date(user.last_login_at), 'yyyy-MM-dd HH:mm')
      : 'N/A',
    // Mapping additional fields
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
