import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { UserSettings } from "@shared/types";

interface UseSettingsReturn {
  settings: UserSettings | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const result = await response.json();
      setSettings(result.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
  };
}