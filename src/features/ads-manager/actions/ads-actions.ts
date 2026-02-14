'use server';

import { revalidatePath } from 'next/cache';
import { createAd, updateAd, deleteAd, Ad } from '../services/ads.service';

export async function createAdAction(data: Omit<Ad, 'id'>) {
  try {
    await createAd(data);
    revalidatePath('/dashboard/ads-manager');
    return { success: true };
  } catch (error) {
    console.error('Failed to create ad:', error);
    return { success: false, error: 'Failed to create ad' };
  }
}

export async function updateAdAction(
  id: number,
  data: Partial<Omit<Ad, 'id'>>
) {
  try {
    await updateAd(id, data);
    revalidatePath('/dashboard/ads-manager');
    return { success: true };
  } catch (error) {
    console.error('Failed to update ad:', error);
    return { success: false, error: 'Failed to update ad' };
  }
}

export async function deleteAdAction(id: number) {
  try {
    await deleteAd(id);
    revalidatePath('/dashboard/ads-manager');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete ad:', error);
    return { success: false, error: 'Failed to delete ad' };
  }
}
