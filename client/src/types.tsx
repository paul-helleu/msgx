export interface User {
  id: number;
  username: string;
}

export interface Conversation {
  id: number;
  channel_id: User;
}

export interface UserConversation {
  id: number;
  User: User;
  Conversation: User;
}
