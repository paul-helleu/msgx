import type { User } from './User';

export interface Conversation {
  id: number;
  channel_id: string;
  is_group: boolean | false;
  name: string;
}

export interface ConversationResponse {
  id: number;
  channel_id: string;
  is_group: boolean | false;
  name: string;
  User: User;
  members_count: 3;
  newMessages: number;
}
