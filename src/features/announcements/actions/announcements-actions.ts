'use server';

import { revalidatePath } from 'next/cache';
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  Announcement
} from '../services/announcements.service';

export async function createAnnouncementAction(
  data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
) {
  try {
    await createAnnouncement(data);
    revalidatePath('/dashboard/announcements');
    return { success: true };
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return { success: false, error: 'Failed to create announcement' };
  }
}

export async function updateAnnouncementAction(
  id: number,
  data: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>
) {
  try {
    await updateAnnouncement(id, data);
    revalidatePath('/dashboard/announcements');
    return { success: true };
  } catch (error) {
    console.error('Failed to update announcement:', error);
    return { success: false, error: 'Failed to update announcement' };
  }
}

export async function deleteAnnouncementAction(id: number) {
  try {
    await deleteAnnouncement(id);
    revalidatePath('/dashboard/announcements');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return { success: false, error: 'Failed to delete announcement' };
  }
}
