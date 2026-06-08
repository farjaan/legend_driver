import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type { ChatMessage, ChatThread } from '@domain/chat.types';

export const chatService = {
  fetchThreads: async (): Promise<ChatThread[]> => {
    const res = await post<ApiResponse<{ threads: ChatThread[] }>>(
      DriverEndpoints.CHAT.THREADS,
      {},
    );
    return res.data.threads;
  },

  fetchDispatchMessages: async (): Promise<ChatMessage[]> => {
    const res = await post<ApiResponse<{ messages: ChatMessage[] }>>(
      DriverEndpoints.CHAT.DISPATCH_MESSAGES,
      {},
    );
    return res.data.messages;
  },
};
