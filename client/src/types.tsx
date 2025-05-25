export interface User {
  id: number;
  username: string;
}

export interface Conversation {
  id: number;
  user: User;
}
