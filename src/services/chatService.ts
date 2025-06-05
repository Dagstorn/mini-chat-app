import { Platform } from "react-native";
import { Chat } from "../types/Chat";

const API_BASE =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_API_BASE_ANDROID
    : process.env.EXPO_PUBLIC_API_BASE;

export const createOrGetChat = async (
  creator: string,
  contactName: string
): Promise<string> => {
  const res = await fetch(`${API_BASE}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creator, contactName }),
  });

  if (!res.ok) throw new Error("Failed to create or get chat");

  const data = await res.json();
  return data.id;
};

export const fetchChats = async (userName: string): Promise<Chat[]> => {
  console.log("fetching chats from: ", API_BASE);
  const res = await fetch(
    `${API_BASE}/chats?user=${encodeURIComponent(userName)}`
  );
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
};

export const fetchChatById = async (chatId: string): Promise<Chat> => {
  const res = await fetch(`${API_BASE}/chats/${chatId}`);
  if (!res.ok) throw new Error("Failed to fetch chat");
  return res.json();
};
