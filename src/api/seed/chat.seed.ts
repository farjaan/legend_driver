import type { ChatMessage, ChatThread } from '@domain/chat.types';

export const CHAT_THREADS_SEED: ChatThread[] = [
  {
    id: 'dispatch',
    type: 'dispatch',
    title: 'Dispatch',
    subtitle: 'Operations team',
    last_message:
      'Customer on LGC-2026-44821 requested call 10 min before arrival.',
    last_message_at: '2026-05-26T13:40:00+04:00',
    unread_count: 1,
    icon: 'headset',
  },
  {
    id: 'support',
    type: 'support',
    title: 'Driver Support',
    subtitle: 'Help desk',
    last_message: 'Your roadside assistance ticket has been assigned.',
    last_message_at: '2026-05-25T16:20:00+04:00',
    unread_count: 0,
    icon: 'life-ring',
  },
  {
    id: 'fleet',
    type: 'fleet',
    title: 'Fleet Manager',
    subtitle: 'Vehicle & compliance',
    last_message: 'Please upload updated registration for VEH-204.',
    last_message_at: '2026-05-24T09:15:00+04:00',
    unread_count: 2,
    icon: 'car',
  },
];

export const DISPATCH_CHAT_SEED: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'dispatch',
    text: 'Good morning Ahmed — you have 3 jobs today. JOB-9001 is same-day priority.',
    sent_at: '2026-05-26T08:00:00+04:00',
  },
  {
    id: 'm2',
    sender: 'driver',
    text: 'Copy. Starting with Marina delivery after shift start.',
    sent_at: '2026-05-26T08:05:00+04:00',
  },
  {
    id: 'm3',
    sender: 'dispatch',
    text: 'Customer on LGC-2026-44821 requested call 10 min before arrival.',
    sent_at: '2026-05-26T13:40:00+04:00',
  },
];
