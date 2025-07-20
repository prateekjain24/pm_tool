import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Copy, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Check,
  Key
} from "lucide-react";
import type { ApiKey } from "@shared/types";
import { maskApiKey } from "@shared/schemas";
import { useSettings } from "@/hooks/useSettings";

export function ApiKeySettings() {
  const { getToken } = useAuth();
  const { settings, isLoading, refetch } = useSettings();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyResult, setNewKeyResult] = useState<{ key: string; plainText: string } | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Initialize API keys from settings
  useEffect(() => {
    if (settings?.apiKeys) {
      setApiKeys(settings.apiKeys);
    }
  }, [settings]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/settings/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      const result = await response.json();
      const { apiKey, plainTextKey } = result.data;

      // Update local state immediately for optimistic update
      setApiKeys(prev => [...prev, apiKey]);
      setNewKeyResult({ key: apiKey.key, plainText: plainTextKey });
      setNewKeyName("");
      
      // Refetch settings to ensure consistency
      refetch();
    } catch (error) {
      console.error("Failed to create API key:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/settings/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      // Update local state immediately for optimistic update
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      // Refetch settings to ensure consistency
      refetch();
    } catch (error) {
      console.error("Failed to delete API key:", error);
    }
  };

  const handleCopyKey = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (error) {
      console.error("Failed to copy key:", error);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Create New Key Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>
            Generate a new API key for programmatic access to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="mt-1"
                disabled={isCreating}
              />
            </div>
            <Button type="submit" disabled={isCreating || !newKeyName.trim()}>
              {isCreating ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </>
              )}
            </Button>
          </form>

          {/* New Key Result */}
          {newKeyResult && (
            <Alert className="mt-4 border-green-500">
              <Key className="h-4 w-4" />
              <div className="ml-2">
                <p className="font-semibold">API Key Created Successfully!</p>
                <p className="text-sm mt-1">
                  Make sure to copy this key now. You won't be able to see it again.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                    {newKeyResult.plainText}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyKey(newKeyResult.plainText, "new")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your existing API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : apiKeys.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No API keys yet. Create your first key above.
            </p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{apiKey.name}</p>
                      {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() && (
                        <span className="text-xs text-red-500 font-medium">Expired</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <code className="text-sm text-muted-foreground font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()} • 
                      {apiKey.lastUsedAt ? (
                        ` Last used: ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`
                      ) : (
                        " Never used"
                      )}
                      {apiKey.expiresAt && (
                        ` • Expires: ${new Date(apiKey.expiresAt).toLocaleDateString()}`
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                    >
                      {copiedKeyId === apiKey.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Usage Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <div className="ml-2">
          <p className="font-semibold">API Documentation</p>
          <p className="text-sm mt-1">
            Learn how to use the PM Tools API in our{" "}
            <a href="/docs/api" className="text-primary hover:underline">
              API documentation
            </a>
            .
          </p>
        </div>
      </Alert>
    </div>
  );
}