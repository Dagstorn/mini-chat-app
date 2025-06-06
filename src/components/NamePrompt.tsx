import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNamePrompt } from '../hooks/useNamePrompt';

const NamePrompt: React.FC = () => {
  const { name, input, setInput, loading, error, onSubmit } = useNamePrompt();

  if (name) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <Text className="text-2xl font-semibold mb-4">
            Please enter your name
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Your name"
            className="border border-[#000] rounded-md px-3 py-2 mb-2"
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            autoFocus
          />
          {error ? (
            <Text className="text-red-500 text-sm mb-2">{error}</Text>
          ) : null}
          <Pressable
            testID="submit-button"
            onPress={onSubmit}
            disabled={input.trim().length === 0 || loading}
            className={`rounded-md justify-center items-center px-3 py-2 ${
              input.trim().length > 0 ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">OK</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default NamePrompt;
