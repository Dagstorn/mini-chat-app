import socket from "@/lib/socket";
import { useUserStore } from "@/store/userStore";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from "react-native";

type Chat = {
  id: string;
  users: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
};

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = useUserStore((state) => state.name) || "";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/chats?user=${encodeURIComponent(userName)}`
        );
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("❌ Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userName]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("join-user", { user: userName });

    const handleChatUpdated = (updated: Chat) => {
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          const updatedChats = [...prev];
          updatedChats[index] = updated;
          return [...updatedChats];
        }
        return [updated, ...prev]; // new chat
      });
    };

    socket.on("chat-updated", handleChatUpdated);

    return () => {
      socket.off("chat-updated", handleChatUpdated);
    };
  }, [userName]);

  const renderItem = ({ item }: ListRenderItemInfo<Chat>) => {
    const otherUser = item.users.find((u) => u !== userName) || "Unknown";
    const initials = otherUser
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2);

    return (
      <Link href={`/chats/${item.id}`} asChild>
        <Pressable className="flex-row items-center px-4 py-3 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
            <Text className="text-white text-lg font-semibold">{initials}</Text>
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-semibold text-black dark:text-white">
                {otherUser}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {item.timestamp}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text
                className="text-sm text-gray-600 dark:text-gray-300 max-w-[80%]"
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View className="bg-blue-500 rounded-full px-2 py-0.5 ml-2">
                  <Text className="text-white text-xs font-medium">
                    {item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500 dark:text-gray-300">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <Text>Loading chats...</Text>
      ) : chats.length === 0 ? (
        <Text className="text-gray-500 text-center mt-8">No chats found.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 12 }}
          className="bg-white dark:bg-black"
        />
      )}
    </View>
  );
};

export default Chats;
