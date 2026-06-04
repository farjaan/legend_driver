import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { ChatMessage } from '@domain/chat.types';

export const chatService = {
  fetchDispatchMessages: async (): Promise<ChatMessage[]> => {
    const res = await post<ApiResponse<{ messages: ChatMessage[] }>>(
      DriverEndpoints.CHAT.DISPATCH_MESSAGES,
      {},
    );
    return res.data.messages;
  },
};
