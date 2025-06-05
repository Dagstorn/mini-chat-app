import socket from "@/src/lib/socket";
import { Chat } from "@/src/types/Chat";
import { useEffect } from "react";

export const useChatSocket = (
  userName: string | null,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  useEffect(() => {
    if (!userName) return;

    if (!socket.connected) socket.connect();
    socket.emit("join-user", { user: userName });

    const handleChatUpdated = (updated: Chat) => {
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          const updatedChats = [...prev];
          updatedChats[index] = updated;
          return updatedChats;
        }
        return [updated, ...prev];
      });
    };

    socket.on("chat-updated", handleChatUpdated);
    return () => {
      socket.off("chat-updated", handleChatUpdated);
    };
  }, [userName, setChats]);
};
