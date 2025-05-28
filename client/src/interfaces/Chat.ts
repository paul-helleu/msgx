import type { Conversation } from './Conversation';
import type { Message } from './Message';

export interface ChatStore {
  messages: Message[];
  conversations: Conversation[];
  currentChannelId: string;
}
