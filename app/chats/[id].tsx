import { ChatHeader } from '@/src/components/ChatHeader';
import { MessageBubble } from '@/src/components/MessageBubble';
import { MessageInput } from '@/src/components/MessageInput';
import { useChat } from '@/src/hooks/useChat';
import { useUserStore } from '@/src/store/userStore';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatDetails: React.FC = () => {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const userName = useUserStore((state) => state.name);
  const { messages, handleSend, renderCheckMarks } = useChat(chatId!, userName);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({
          ios: 'padding',
          android: undefined,
        })}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <ChatHeader title={userName} />

        <FlatList
          className="px-4 pt-4 flex-1"
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMe={item.sender === userName}
              renderCheckMarks={renderCheckMarks}
            />
          )}
          inverted
          keyboardDismissMode="interactive"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          keyboardShouldPersistTaps="handled"
        />

        <MessageInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetails;
