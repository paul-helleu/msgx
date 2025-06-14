import type { ConversationResponse } from './Conversation';
import type { Message } from './Message';

export interface ChatStore {
  messages: Message[];
  conversations: ConversationResponse[];
  currentConversation?: ConversationResponse;
}
