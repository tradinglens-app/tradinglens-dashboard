'use server';

import { getCommunityUserById } from '../services/community-users.service';

export async function getUserDetails(userId: string) {
  try {
    const user = await getCommunityUserById(userId);
    return { data: user, error: null };
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    return { data: null, error: 'Failed to fetch user details' };
  }
}
