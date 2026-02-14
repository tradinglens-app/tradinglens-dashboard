'use server';

import {
  getBugReportsService,
  GetBugReportsParams
} from '../services/report.service';

export async function getBugReports(params: GetBugReportsParams = {}) {
  return await getBugReportsService(params);
}
