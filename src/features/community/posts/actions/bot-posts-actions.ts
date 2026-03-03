'use server';

import {
  getBotPosts,
  updateBotPost,
  deleteBotPost,
  GetPostsParams
} from '../services/posts.service';
import { revalidatePath } from 'next/cache';

export async function getBotPostsAction(params: GetPostsParams = {}) {
  return await getBotPosts(params);
}

export async function updateBotPostAction(
  id: string,
  data: { content?: string; visibility?: string }
) {
  try {
    await updateBotPost(id, data);
    revalidatePath('/dashboard/community/bot-posts');
    return { success: true };
  } catch (error) {
    console.error('Failed to update bot post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

export async function deleteBotPostAction(id: string) {
  try {
    await deleteBotPost(id);
    revalidatePath('/dashboard/community/bot-posts');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete bot post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
