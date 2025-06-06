import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ChatHeaderProps {
  title: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View className="h-14 border-b border-gray-200 flex-row items-center px-4 bg-white">
      <Pressable onPress={router.back} className="mr-3" testID="back-button">
        <Ionicons name="arrow-back" size={24} color="#1f2937" />
      </Pressable>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
    </View>
  );
};
