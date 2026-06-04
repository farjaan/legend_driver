import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { DriverNotification } from '@domain/notification.types';

export const notificationService = {
  fetchNotifications: async (): Promise<DriverNotification[]> => {
    const res = await post<ApiResponse<{ notifications: DriverNotification[] }>>(
      DriverEndpoints.NOTIFICATIONS.LIST,
      {},
    );
    return res.data.notifications;
  },
};
