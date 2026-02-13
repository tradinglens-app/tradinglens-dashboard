'use server';

import {
  getCommunityUsers,
  GetCommunityUsersParams,
  updateUserAccountStatus
} from '../services/community-users.service';
import { revalidatePath } from 'next/cache';

export async function getCommunityUsersAction(params: GetCommunityUsersParams) {
  return await getCommunityUsers(params);
}

export async function updateUserAccountStatusAction(
  userId: string,
  status: string
) {
  try {
    await updateUserAccountStatus(userId, status);
    revalidatePath('/dashboard/community/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user account status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
