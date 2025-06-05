import { ContactItem } from "@/src/components/ContactItem";
import { useContacts } from "@/src/hooks/useContacts";
import { createOrGetChat } from "@/src/services/chatService";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const Contacts: React.FC = () => {
  const { name } = useUserStore();

  const { contacts, loading, error } = useContacts(name);
  const router = useRouter();

  const handlePress = async (contactName: string) => {
    try {
      const chatId = await createOrGetChat(name, contactName);
      router.push(`/chats/${chatId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1  bg-white">
      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <FlatList
        data={contacts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ContactItem name={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
};

export default Contacts;
