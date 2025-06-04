import socket from "@/lib/socket";
import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  seenBy: string[]; // array of usernames who saw this message
};

type Chat = {
  id: string;
  users: string[];
  lastMessage: string;
  timestamp: string;
  messages: Message[];
};

const ChatDetails: React.FC = () => {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const userName = useUserStore((state) => state.name);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const chatName = (users: string[]) => {
    const others = users.filter((u) => u !== userName);
    return others.length > 1 ? others.join(", ") : others[0] || "Unknown";
  };

  // Mark all messages as seen by current user and update server
  const markMessagesSeen = useCallback(() => {
    if (!chatId || !userName) return;
    // Send socket event to notify server that user has seen all messages in this chat
    socket.emit("mark-seen", { chatId, user: userName });

    // Optimistically update local messages' seenBy to include current user
    setMessages((prev) =>
      prev.map((msg) => {
        if (!msg.seenBy.includes(userName)) {
          return { ...msg, seenBy: [...msg.seenBy, userName] };
        }
        return msg;
      })
    );
  }, [chatId, userName]);

  // Fetch chat and messages initially
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!chatId) return;
      try {
        const res = await fetch(`http://localhost:3000/chats/${chatId}`);
        if (!res.ok) throw new Error("Failed to fetch chat");
        const data = await res.json();
        setChat(data);
        // Reverse messages so newest is at the bottom (FlatList inverted)
        setMessages(data.messages.slice().reverse());

        // After loading messages, mark them as seen
        markMessagesSeen();
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    loadInitialMessages();
  }, [chatId, markMessagesSeen]);

  // Setup socket listeners
  useEffect(() => {
    if (!chatId || !userName) return;

    if (!socket.connected) socket.connect();

    // Join the chat room to receive new messages
    socket.emit("join-chat", { chatId });

    // Join the user room for user-specific events (like chat updates)
    socket.emit("join-user", { user: userName });

    // Handle incoming new messages
    const handleMessage = (msg: Message) => {
      setMessages((prev) => [msg, ...prev]);
      // When new message arrives, mark it as seen by current user (auto read)
      socket.emit("mark-seen", { chatId, user: userName, messageId: msg.id });
    };

    // Handle updated message with seenBy info from server
    const handleSeenUpdate = ({
      messageId,
      seenBy,
    }: {
      messageId: string;
      seenBy: string[];
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, seenBy: seenBy } : msg
        )
      );
    };

    socket.on("message", handleMessage);
    socket.on("message-seen", handleSeenUpdate);

    return () => {
      socket.off("message", handleMessage);
      socket.off("message-seen", handleSeenUpdate);
    };
  }, [chatId, userName]);

  const handleSend = () => {
    if (!inputText.trim() || !userName || !chatId) return;

    socket.emit("send-message", {
      chatId,
      text: inputText.trim(),
      sender: userName,
    });

    setInputText("");
  };

  const renderCheckMarks = (msg: Message) => {
    if (msg.sender !== userName) return null;

    const otherUsers = chat?.users.filter((u) => u !== userName) || [];
    const allSeen = otherUsers.every((u) => msg.seenBy.includes(u));

    return (
      <Ionicons
        name={allSeen ? "checkmark-done" : "checkmark"}
        size={18}
        color={"#fff"}
        style={{ marginLeft: 4 }}
      />
    );
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === userName;

    return (
      <View
        className={`flex flex-row gap-1 my-1 max-w-3/4 px-3 py-2 rounded-lg ${
          isMe
            ? "bg-accent self-end rounded-br-none"
            : "bg-gray-200 rounded-bl-none self-start"
        }`}
      >
        <Text className={`${isMe ? "text-white" : "text-gray-900"}`}>
          {item.text}
        </Text>
        <View className="flex flex-row">
          <Text
            className={`text-xs mt-1 ${
              isMe ? "text-blue-200" : "text-gray-600"
            } text-right`}
          >
            {item.timestamp}
          </Text>
          {renderCheckMarks(item)}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View className="h-14 border-b border-gray-200 flex-row items-center px-4 bg-white">
          <Pressable onPress={router.back} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">
            Chat with {chatName(chat?.users || [])}
          </Text>
        </View>

        <FlatList
          className="px-4 pt-4 flex-1"
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          keyboardDismissMode="interactive"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
          keyboardShouldPersistTaps="handled"
        />

        <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message"
            placeholderTextColor="#999"
            className="flex-1 h-12 bg-gray-100 rounded-full px-4 py-2 text-gray-900"
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            className="ml-3 h-12 flex justify-center items-center bg-blue-600 rounded-full p-3"
          >
            <Text className="text-white font-bold">Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetails;
