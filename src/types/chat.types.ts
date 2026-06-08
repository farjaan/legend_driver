export type ChatThreadType = 'dispatch' | 'support' | 'fleet';

export interface ChatThread {
  id: string;
  type: ChatThreadType;
  title: string;
  subtitle: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'dispatch';
  text: string;
  sent_at: string;
}
