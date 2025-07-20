import { Building, ChevronDown, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

export function WorkspaceSelector() {
  const { workspaces, currentWorkspace, isLoading, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchWorkspace = async (workspaceId: string) => {
    if (workspaceId === currentWorkspace?.id) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await switchWorkspace(workspaceId);
      setIsOpen(false);
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-muted-foreground">Loading workspaces...</span>
      </div>
    );
  }

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "hover:bg-accent transition-colors",
          "text-sm font-medium",
          isOpen && "bg-accent",
        )}
        disabled={isSwitching}
      >
        <Building className="h-4 w-4" />
        <span className="max-w-[150px] truncate">{currentWorkspace.name}</span>
        {isSwitching ? (
          <LoadingSpinner size="sm" />
        ) : (
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Close workspace selector"
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(false);
              }
            }}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 z-50">
            <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              {/* Current workspace info */}
              <div className="p-3 border-b border-border">
                <div className="text-xs text-muted-foreground mb-1">Current workspace</div>
                <div className="font-medium">{currentWorkspace.name}</div>
                {currentWorkspace.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {currentWorkspace.description}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{currentWorkspace.memberCount} members</span>
                  <span className="text-xs">•</span>
                  <span className="capitalize">{currentWorkspace.plan} plan</span>
                </div>
              </div>

              {/* Workspace list */}
              <div className="max-h-64 overflow-y-auto">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    type="button"
                    onClick={() => handleSwitchWorkspace(workspace.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-accent transition-colors",
                      "flex items-center justify-between",
                      workspace.id === currentWorkspace.id && "bg-accent",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{workspace.name}</span>
                    </div>
                    {workspace.id === currentWorkspace.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Create workspace */}
              <div className="p-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    // TODO: Open create workspace modal
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create new workspace
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
