import { useUserStore } from "@/src/store/userStore";
import { useState } from "react";
import { registerName } from "../services/contactService";

export const useNamePrompt = () => {
  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return;

    setLoading(true);
    setError("");

    const result = await registerName(trimmed);

    if (result === "success") {
      setName(trimmed);
    } else if (result === "conflict") {
      setError("That name is already taken.");
    } else {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return {
    name,
    input,
    setInput,
    loading,
    error,
    onSubmit,
  };
};
