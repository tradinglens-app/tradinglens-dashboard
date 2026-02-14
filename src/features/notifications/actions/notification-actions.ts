'use server';

import {
  getNotifications,
  GetNotificationsParams
} from '../services/notifications.service';

export async function getNotificationsAction(
  params: GetNotificationsParams = {}
) {
  return await getNotifications(params);
}
