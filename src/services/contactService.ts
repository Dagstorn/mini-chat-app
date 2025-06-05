import { Platform } from "react-native";

const API_BASE =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_API_BASE_ANDROID
    : process.env.EXPO_PUBLIC_API_BASE;

export const fetchContacts = async (): Promise<{ name: string }[]> => {
  const res = await fetch(`${API_BASE}/contacts`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
};

export const registerName = async (
  name: string
): Promise<"success" | "conflict" | "error"> => {
  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.status === 201) return "success";
    if (res.status === 409) return "conflict";
    return "error";
  } catch {
    return "error";
  }
};
