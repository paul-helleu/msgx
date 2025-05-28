import type { User } from './User';
import type { Conversation } from './Conversation';

export interface Message {
  id: number;
  conversation: Conversation;
  Sender: User;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
