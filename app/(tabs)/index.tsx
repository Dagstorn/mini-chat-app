import { ChatItem } from "@/src/components/ChatItem";
import { useChatsList } from "@/src/hooks/useChatsList";
import { useUserStore } from "@/src/store/userStore";
import React from "react";
import { FlatList, Text, View } from "react-native";

const Chats: React.FC = () => {
  const { name: userName } = useUserStore();
  const { chats, loading } = useChatsList();

  if (!userName) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">User not found</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white ">
        <Text className="text-gray-500 dark:text-gray-300">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {chats.length === 0 ? (
        <Text className="text-gray-500 text-center mt-8">No chats found.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem chat={item} currentUser={userName} />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
          className="bg-white dark:bg-black"
        />
      )}
    </View>
  );
};

export default Chats;
