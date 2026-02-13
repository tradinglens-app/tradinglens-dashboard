import { prisma } from '@/lib/prisma';

export interface VerificationStats {
  verified: number;
  unverified: number;
  total: number;
}

export async function getUserVerificationStats(): Promise<VerificationStats> {
  try {
    const verifiedCount = await prisma.users.count({
      where: {
        is_verified: true
      }
    });

    const unverifiedCount = await prisma.users.count({
      where: {
        is_verified: false
      }
    });

    return {
      verified: verifiedCount,
      unverified: unverifiedCount,
      total: verifiedCount + unverifiedCount
    };
  } catch (error) {
    console.error('Error fetching user verification stats:', error);
    return {
      verified: 0,
      unverified: 0,
      total: 0
    };
  }
}
