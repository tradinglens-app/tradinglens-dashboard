'use server';

import { getRecentUsers } from '../services/recent-users.service';

/**
 * Fetches recent users and today's registration count.
 */
export async function getRecentUsersAction() {
  return await getRecentUsers();
}
