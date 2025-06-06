import socket from '@/src/lib/socket';
import { fetchChatById } from '@/src/services/chatService';
import { Chat } from '@/src/types/Chat';
import { Message } from '@/src/types/Message';
import { useCallback, useEffect, useState } from 'react';

export const useChat = (chatId: string, userName: string) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const markMessagesSeen = useCallback(() => {
    if (!chatId || !userName) return;
    socket.emit('mark-seen', { chatId, user: userName });
    setMessages((prev) =>
      prev.map((msg) =>
        msg.seenBy.includes(userName)
          ? msg
          : { ...msg, seenBy: [...msg.seenBy, userName] },
      ),
    );
  }, [chatId, userName]);

  useEffect(() => {
    const loadChat = async () => {
      try {
        const data = await fetchChatById(chatId);
        setChat(data);
        setMessages(data.messages.slice().reverse());
        markMessagesSeen();
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    };

    loadChat();
  }, [chatId, markMessagesSeen]);

  useEffect(() => {
    if (!chatId || !userName) return;

    if (!socket.connected) socket.connect();

    socket.emit('join-chat', { chatId });
    socket.emit('join-user', { user: userName });

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [msg, ...prev]);
      socket.emit('mark-seen', { chatId, user: userName, messageId: msg.id });
    };

    const handleSeenUpdate = ({
      messageId,
      seenBy,
    }: {
      messageId: string;
      seenBy: string[];
    }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, seenBy } : msg)),
      );
    };

    socket.on('message', handleMessage);
    socket.on('message-seen', handleSeenUpdate);

    return () => {
      socket.off('message', handleMessage);
      socket.off('message-seen', handleSeenUpdate);
    };
  }, [chatId, userName]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    socket.emit('send-message', {
      chatId,
      text: text.trim(),
      sender: userName,
    });
  };

  const renderCheckMarks = (msg: Message) => {
    if (msg.sender !== userName) return false;
    const otherUsers = chat?.users.filter((u) => u !== userName) || [];
    const allSeen = otherUsers.every((u) => msg.seenBy.includes(u));

    return allSeen;
  };

  return {
    chat,
    messages,
    handleSend,
    renderCheckMarks,
  };
};
