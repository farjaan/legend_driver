export type SupportTicketStatus = 'open' | 'in_progress' | 'closed';

export type SupportTicketPriority = 'low' | 'medium' | 'high';

export type SupportTicketCategory =
  | 'vehicle'
  | 'app'
  | 'customer'
  | 'payment'
  | 'booking'
  | 'document';

export interface SupportTicketMessage {
  id: string;
  sender: 'driver' | 'admin';
  body: string;
  sent_at: string;
  attachment_uri?: string;
}

export interface SupportTicket {
  ticket_id: string;
  ticket_number: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  created_at: string;
  location?: string;
  messages: SupportTicketMessage[];
}

export interface CreateSupportTicketPayload {
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  subject: string;
  description: string;
  location?: string;
  attachment_uri?: string;
}
