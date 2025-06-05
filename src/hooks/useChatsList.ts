import { fetchChats } from "@/src/services/chatService";
import { useUserStore } from "@/src/store/userStore";
import { Chat } from "@/src/types/Chat";
import { useEffect, useState } from "react";
import { useChatSocket } from "./useChatSocket";

export const useChatsList = () => {
  const { name: userName } = useUserStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;

    const load = async () => {
      try {
        const data = await fetchChats(userName);
        setChats(data);
      } catch (err) {
        console.error("❌ Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userName]);

  useChatSocket(userName, setChats);

  return { chats, loading };
};
