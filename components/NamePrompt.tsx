import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const NamePrompt: React.FC = () => {
  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (name) return null;

  const onSubmit = async () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (res.status === 201) {
        setName(trimmed);
      } else if (res.status === 409) {
        setError("That name is already taken.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            onPress={onSubmit}
            disabled={input.trim().length === 0 || loading}
            className={`rounded-md justify-center items-center px-3 py-2 ${
              input.trim().length > 0 ? "bg-blue-600" : "bg-gray-400"
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
