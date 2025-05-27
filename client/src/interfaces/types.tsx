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

export interface Message {
  id: number;
  conversation: Conversation;
  sender: User;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
