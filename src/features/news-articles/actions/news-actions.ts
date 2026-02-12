'use server';

import { revalidatePath } from 'next/cache';
import {
  NewsArticle,
  GetNewsParams,
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsActive,
  CreateNewsInput
} from '../services/news.service';

export async function getNewsAction(params: GetNewsParams) {
  try {
    return await getNews(params);
  } catch (error: any) {
    console.error('getNewsAction error:', error);
    throw error;
  }
}

export async function getNewsByIdAction(id: string) {
  try {
    return await getNewsById(id);
  } catch (error: any) {
    console.error('getNewsByIdAction error:', error);
    throw error;
  }
}

export async function saveNewsAction(data: CreateNewsInput & { id?: string }) {
  try {
    if (data.id) {
      await updateNews(data.id, data);
    } else {
      await createNews(data);
    }
    revalidatePath('/dashboard/news');
    revalidatePath('/dashboard/news-articles');
    return { success: true };
  } catch (error: any) {
    console.error('saveNewsAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleNewsActiveAction(id: string, isActive: boolean) {
  try {
    await toggleNewsActive(id, isActive);
    revalidatePath('/dashboard/news');
    revalidatePath('/dashboard/news-articles');
    return { success: true };
  } catch (error: any) {
    console.error('toggleNewsActiveAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    await deleteNews(id);
    revalidatePath('/dashboard/news');
    revalidatePath('/dashboard/news-articles');
    return { success: true };
  } catch (error: any) {
    console.error('deleteNewsAction error:', error);
    return { success: false, error: error.message };
  }
}
