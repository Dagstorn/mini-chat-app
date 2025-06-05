import { Chat } from "@/src/types/Chat";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  chat: Chat;
  currentUser: string;
};

export const ChatItem: React.FC<Props> = ({ chat, currentUser }) => {
  const otherUser = chat.users.find((u) => u !== currentUser) || "Unknown";
  const initials = otherUser
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  return (
    <Link href={`/chats/${chat.id}`} asChild>
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
              {chat.timestamp}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text
              className="text-sm text-gray-600 dark:text-gray-300 max-w-[80%]"
              numberOfLines={1}
            >
              {chat.lastMessage}
            </Text>
            {chat.unreadCount > 0 && (
              <View className="bg-blue-500 rounded-full px-2 py-0.5 ml-2">
                <Text className="text-white text-xs font-medium">
                  {chat.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
