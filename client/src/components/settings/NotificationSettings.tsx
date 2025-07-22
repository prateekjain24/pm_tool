import { useAuth } from "@clerk/clerk-react";
import type { NotificationPreferences } from "@shared/types";
import { AlertCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";

// Default notification preferences
const defaultPreferences: NotificationPreferences = {
  email: {
    marketingEmails: false,
    productUpdates: true,
    experimentResults: true,
    weeklyDigest: true,
  },
  inApp: {
    experimentUpdates: true,
    collaborationActivity: true,
    systemAlerts: true,
  },
};

export function NotificationSettings() {
  const { getToken } = useAuth();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Initialize preferences when settings load from backend
  useEffect(() => {
    if (settings?.notifications) {
      setPreferences(settings.notifications);
    }
  }, [settings]);

  const handleToggle = (
    category: keyof NotificationPreferences,
    setting: string,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/settings/notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update notification preferences");
      }

      await response.json();
      setSaveMessage({ type: "success", message: "Notification preferences saved!" });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setSaveMessage({ type: "error", message: "Failed to save preferences. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSettings) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Save message */}
      {saveMessage && (
        <Alert
          className={`flex items-center gap-2 ${saveMessage.type === "success" ? "border-green-500" : ""}`}
        >
          {saveMessage.type === "success" ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{saveMessage.message}</span>
        </Alert>
      )}

      {/* Email Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              id="marketing"
              checked={preferences.email.marketingEmails}
              onCheckedChange={(checked) => handleToggle("email", "marketingEmails", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="product">Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about product changes and improvements
              </p>
            </div>
            <Switch
              id="product"
              checked={preferences.email.productUpdates}
              onCheckedChange={(checked) => handleToggle("email", "productUpdates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="experiments">Experiment Results</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when experiments complete
              </p>
            </div>
            <Switch
              id="experiments"
              checked={preferences.email.experimentResults}
              onCheckedChange={(checked) => handleToggle("email", "experimentResults", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Weekly summary of your experiments and activity
              </p>
            </div>
            <Switch
              id="weekly"
              checked={preferences.email.weeklyDigest}
              onCheckedChange={(checked) => handleToggle("email", "weeklyDigest", checked)}
            />
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-4">In-App Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="exp-updates">Experiment Updates</Label>
              <p className="text-sm text-muted-foreground">
                Real-time updates about your running experiments
              </p>
            </div>
            <Switch
              id="exp-updates"
              checked={preferences.inApp.experimentUpdates}
              onCheckedChange={(checked) => handleToggle("inApp", "experimentUpdates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="collaboration">Collaboration Activity</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about team member activities
              </p>
            </div>
            <Switch
              id="collaboration"
              checked={preferences.inApp.collaborationActivity}
              onCheckedChange={(checked) => handleToggle("inApp", "collaborationActivity", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system">System Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Important system notifications and alerts
              </p>
            </div>
            <Switch
              id="system"
              checked={preferences.inApp.systemAlerts}
              onCheckedChange={(checked) => handleToggle("inApp", "systemAlerts", checked)}
            />
          </div>
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
            "Save Preferences"
          )}
        </Button>
      </div>
    </form>
  );
}
