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
  Conversation: Conversation;
  Sender: User;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
