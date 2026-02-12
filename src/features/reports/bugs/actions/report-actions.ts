'use server';

import { revalidatePath } from 'next/cache';
import {
  getBugReportsService,
  GetBugReportsParams
} from '../services/report.service';

export async function getBugReports(params: GetBugReportsParams = {}) {
  return await getBugReportsService(params);
}
