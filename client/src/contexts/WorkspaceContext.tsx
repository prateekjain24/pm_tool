import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { Workspace, WorkspaceWithMembers } from "@shared/types";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: WorkspaceWithMembers | null;
  isLoading: boolean;
  error: string | null;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (data: { name: string; description?: string }) => Promise<Workspace>;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    if (!isSignedIn) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const result = await response.json();
      const userWorkspaces = result.data || [];
      setWorkspaces(userWorkspaces);

      // Set current workspace (first one for now)
      if (userWorkspaces.length > 0 && !currentWorkspace) {
        await fetchWorkspaceDetails(userWorkspaces[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workspaces");
      console.error("Error fetching workspaces:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch workspace details
  const fetchWorkspaceDetails = async (workspaceId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspaces/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace details");
      }

      const result = await response.json();
      setCurrentWorkspace(result.data);
      
      // Store current workspace ID in localStorage
      localStorage.setItem("currentWorkspaceId", workspaceId);
    } catch (err) {
      console.error("Error fetching workspace details:", err);
    }
  };

  // Switch workspace
  const switchWorkspace = async (workspaceId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/workspaces/${workspaceId}/switch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to switch workspace");
      }

      await fetchWorkspaceDetails(workspaceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch workspace");
      console.error("Error switching workspace:", err);
    }
  };

  // Create workspace
  const createWorkspace = async (data: { name: string; description?: string }) => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const result = await response.json();
      const newWorkspace = result.data;
      
      // Refresh workspaces list
      await fetchWorkspaces();
      
      // Switch to new workspace
      await switchWorkspace(newWorkspace.id);
      
      return newWorkspace;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace");
      throw err;
    }
  };

  // Initialize workspaces when auth is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchWorkspaces();
    } else if (isLoaded && !isSignedIn) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Restore last workspace on mount
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const lastWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (lastWorkspaceId) {
        const workspace = workspaces.find(w => w.id === lastWorkspaceId);
        if (workspace) {
          fetchWorkspaceDetails(lastWorkspaceId);
        }
      }
    }
  }, [workspaces]);

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    switchWorkspace,
    createWorkspace,
    refreshWorkspaces: fetchWorkspaces,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}