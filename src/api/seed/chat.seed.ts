import type { ChatMessage } from '@domain/chat.types';

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
