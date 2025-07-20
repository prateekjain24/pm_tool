import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";
import { Check, AlertCircle, Monitor, Moon, Sun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ThemePreference } from "@shared/types";
import { useSettings } from "@/hooks/useSettings";

export function AppearanceSettings() {
  const { getToken } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load saved theme preference from backend first, then localStorage as fallback
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
      applyTheme(settings.theme);
      // Also update localStorage to keep in sync
      localStorage.setItem("theme", settings.theme);
    } else if (!isLoadingSettings) {
      // Fallback to localStorage if no backend settings
      const savedTheme = localStorage.getItem("theme") as ThemePreference;
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to system
        applyTheme("system");
      }
    }
  }, [settings, isLoadingSettings]);

  const applyTheme = (newTheme: ThemePreference) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Save to localStorage first for immediate effect
      localStorage.setItem("theme", theme);

      // Save to API
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/settings/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme preference");
      }

      setSaveMessage({ type: "success", message: "Theme preference saved!" });
    } catch (error) {
      console.error("Failed to save theme:", error);
      setSaveMessage({ type: "error", message: "Failed to save theme preference." });
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light background with dark text",
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark background with light text",
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Automatically match your system settings",
    },
  ];

  if (isLoadingSettings) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Save message */}
      {saveMessage && (
        <Alert className={`flex items-center gap-2 ${saveMessage.type === "success" ? "border-green-500" : ""}`}>
          {saveMessage.type === "success" ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{saveMessage.message}</span>
        </Alert>
      )}

      {/* Theme Selection */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="theme">Theme Preference</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme" className="mt-1">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleThemeChange(option.value)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                theme === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <option.icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
              {theme === option.value && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Appearance Settings */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Additional Settings</h3>
        <p className="text-sm text-muted-foreground">
          More appearance customization options coming soon, including:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• Font size preferences</li>
          <li>• Accent color customization</li>
          <li>• Compact/comfortable view modes</li>
          <li>• Animation preferences</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Theme"
          )}
        </Button>
      </div>
    </form>
  );
}