export type Message = {
  id: string;
  text: string;
  chatId: string;
  sender: string;
  timestamp: string;
  seenBy: string[];
};
