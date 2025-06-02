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
  Users: User[];
  members_count: number | 2;
}
