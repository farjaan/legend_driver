export type BreakdownStatus = 'assigned' | 'en_route' | 'on_site' | 'resolved';

export interface BreakdownTicket {
  ticket_id: string;
  booking_reference: string;
  customer_name: string;
  issue_summary: string;
  address: string;
  latitude: number;
  longitude: number;
  status: BreakdownStatus;
  assigned_at: string;
}
