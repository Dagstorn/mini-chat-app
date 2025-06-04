import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const Contacts: React.FC = () => {
  const { name } = useUserStore();
  const [contacts, setContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:3000/contacts");
        const data = await res.json();
        const filtered = data.filter((c: any) => c.name !== name);
        setContacts(filtered.map((c: any) => c.name));
      } catch (err) {
        console.error(err);
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [name]);

  const getChatId = async (contactName: string): Promise<string | null> => {
    console.log("getChatId");
    console.log("contactName: ", contactName);
    try {
      const res = await fetch("http://localhost:3000/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator: name, contactName }),
      });
      console.log("res: ", res);
      const data = await res.json();
      console.log("data: ", data);
      return data.id;
    } catch (err) {
      console.error("Failed to open chat", err);
      return null;
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
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Contacts</Text>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <FlatList
        data={contacts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              const chatId = await getChatId(item);
              if (chatId) {
                router.push(`/chats/${chatId}`);
              }
            }}
            className="p-4 border-b border-gray-200"
          >
            <Text className="text-lg">{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Contacts;
