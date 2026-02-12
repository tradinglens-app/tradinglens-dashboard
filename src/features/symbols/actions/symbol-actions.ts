'use server';

import { revalidatePath } from 'next/cache';
import {
  SymbolData,
  upsertSymbol,
  deleteSymbol
} from '../services/symbol.service';

export async function saveSymbolAction(data: Partial<SymbolData>) {
  try {
    await upsertSymbol(data);
    revalidatePath('/dashboard/symbols-database');
    return { success: true };
  } catch (error: any) {
    console.error('saveSymbolAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSymbolAction(id: string) {
  try {
    await deleteSymbol(id);
    revalidatePath('/dashboard/symbols-database');
    return { success: true };
  } catch (error: any) {
    console.error('deleteSymbolAction error:', error);
    return { success: false, error: error.message };
  }
}
