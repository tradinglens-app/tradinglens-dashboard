'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateVerificationStatus(
  userId: string,
  isVerified: boolean
) {
  try {
    const id = parseInt(userId);
    if (isNaN(id)) throw new Error('Invalid User ID');

    await prisma.users.update({
      where: { user_id: id },
      data: { is_verified: isVerified }
    });

    revalidatePath('/dashboard/user-verification/badge');
    return { success: true };
  } catch (error) {
    console.error('Failed to update verification status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function updateUserNote(userId: string, note: string) {
  try {
    const id = parseInt(userId);
    if (isNaN(id)) throw new Error('Invalid User ID');

    await prisma.users.update({
      where: { user_id: id },
      data: { status_message: note }
    });

    revalidatePath('/dashboard/user-verification/badge');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user note:', error);
    return { success: false, error: 'Failed to update note' };
  }
}
