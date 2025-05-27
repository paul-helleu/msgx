export interface Message {
  id: number;
  sender: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
