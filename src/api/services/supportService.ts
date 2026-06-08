import { post } from '@api/services/apiService';
import { DriverEndpoints } from '@api/urls/endpoints';
import type { ApiResponse } from '@api/models/common.models';
import type {
  CreateSupportTicketPayload,
  SupportTicket,
  SupportTicketMessage,
} from '@domain/support.types';

export const supportService = {
  fetchTickets: async (): Promise<SupportTicket[]> => {
    const res = await post<ApiResponse<{ tickets: SupportTicket[] }>>(
      DriverEndpoints.SUPPORT.LIST,
      {},
    );
    return res.data.tickets;
  },

  createTicket: async (payload: CreateSupportTicketPayload): Promise<SupportTicket> => {
    const res = await post<ApiResponse<{ ticket: SupportTicket }>>(
      DriverEndpoints.SUPPORT.CREATE,
      payload,
    );
    return res.data.ticket;
  },

  replyToTicket: async (
    ticketId: string,
    body: string,
    attachmentUri?: string,
  ): Promise<SupportTicketMessage> => {
    const res = await post<ApiResponse<{ message: SupportTicketMessage }>>(
      DriverEndpoints.SUPPORT.REPLY,
      { ticket_id: ticketId, body, attachment_uri: attachmentUri },
    );
    return res.data.message;
  },
};
