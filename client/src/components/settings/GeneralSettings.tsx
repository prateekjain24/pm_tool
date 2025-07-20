import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import type { UpdateGeneralSettingsInput } from "@shared/types";
import { useSettings } from "@/hooks/useSettings";

export function GeneralSettings() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const [formData, setFormData] = useState<UpdateGeneralSettingsInput>({
    firstName: "",
    lastName: "",
    avatarUrl: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Initialize form data when settings load from backend
  useEffect(() => {
    if (settings) {
      setFormData({
        firstName: settings.firstName || "",
        lastName: settings.lastName || "",
        avatarUrl: settings.avatarUrl || null,
      });
    } else if (user && !isLoadingSettings) {
      // Fallback to Clerk user data if no settings exist
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        avatarUrl: user.imageUrl || null,
      });
    }
  }, [settings, user, isLoadingSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/settings/general`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName || null,
          lastName: formData.lastName || null,
          avatarUrl: formData.avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      const result = await response.json();
      setSaveMessage({ type: "success", message: "Settings saved successfully!" });
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage({ type: "error", message: "Failed to save settings. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UpdateGeneralSettingsInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isLoaded || isLoadingSettings) {
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

      {/* Email (read-only) */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.primaryEmailAddress?.emailAddress || ""}
          disabled
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Email cannot be changed here
        </p>
      </div>

      {/* First Name */}
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={formData.firstName || ""}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Enter your first name"
          className="mt-1"
        />
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          value={formData.lastName || ""}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          placeholder="Enter your last name"
          className="mt-1"
        />
      </div>

      {/* Avatar Preview */}
      <div>
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4 mt-2">
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <p className="text-sm text-muted-foreground">
            Profile picture is managed through your connected account
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}