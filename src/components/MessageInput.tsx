// src/components/MessageInput.tsx
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSend(inputText.trim());
    setInputText("");
  };

  return (
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
  );
};
