import { fetchContacts } from "@/src/services/contactService";
import { useEffect, useState } from "react";

export const useContacts = (currentUserName: string) => {
  const [contacts, setContacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const all = await fetchContacts();
        setContacts(
          all.filter((c) => c.name !== currentUserName).map((c) => c.name)
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUserName]);

  return { contacts, loading, error };
};
