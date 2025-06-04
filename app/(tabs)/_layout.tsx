// app/_layout.tsx

import NamePrompt from "@/components/NamePrompt";
import { useUserStore } from "@/store/userStore";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const InnerLayout = () => {
  const userName = useUserStore((state) => state.name);

  return (
    <>
      {!userName && <NamePrompt />}
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Chats",
            tabBarIcon: ({ color, size }) => (
              <Feather name="message-circle" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color, size }) => (
              <Feather name="users" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default function _layout() {
  return <InnerLayout />;
}
