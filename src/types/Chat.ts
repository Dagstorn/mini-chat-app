import { Message } from "./Message";

export type Chat = {
  id: string;
  users: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
};
