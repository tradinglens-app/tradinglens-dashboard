'use server';

import { revalidatePath } from 'next/cache';
import {
  getBugReportsService,
  seedBugReportsService,
  GetBugReportsParams
} from '../services/report.service';

export async function getBugReports(params: GetBugReportsParams = {}) {
  return await getBugReportsService(params);
}

export async function seedBugReports() {
  await seedBugReportsService();
  revalidatePath('/dashboard/reports/bugs');
  return { success: true };
}
