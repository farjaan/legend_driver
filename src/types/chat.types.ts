export interface ChatMessage {
  id: string;
  sender: 'driver' | 'dispatch';
  text: string;
  sent_at: string;
}
