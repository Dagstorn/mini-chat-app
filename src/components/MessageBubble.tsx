import { Message } from "@/src/types/Message";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  renderCheckMarks: (msg: Message) => boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  renderCheckMarks,
}) => {
  return (
    <View
      className={`flex flex-row gap-1 my-1 max-w-3/4 px-3 py-2 rounded-lg ${
        isMe
          ? "bg-accent self-end rounded-br-none"
          : "bg-gray-200 rounded-bl-none self-start"
      }`}
    >
      <Text className={`${isMe ? "text-white" : "text-gray-900"}`}>
        {message.text}
      </Text>
      <View className="flex flex-row">
        <Text
          className={`text-xs mt-1 ${
            isMe ? "text-blue-200" : "text-gray-600"
          } text-right`}
        >
          {message.timestamp}
        </Text>
        {isMe && (
          <Ionicons
            name={renderCheckMarks(message) ? "checkmark-done" : "checkmark"}
            size={18}
            color={"#fff"}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </View>
  );
};
