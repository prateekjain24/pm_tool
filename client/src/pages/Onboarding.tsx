import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { createWorkspace, workspaces } = useWorkspace();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    role: "",
    experience: "",
    goals: [] as string[],
  });
  const [workspaceData, setWorkspaceData] = useState({
    name: "",
    description: "",
  });
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (workspaces.length === 0 && !workspaceData.name) {
      setError("Please enter a workspace name");
      return;
    }

    setIsCreatingWorkspace(true);
    setError(null);

    try {
      // Create workspace if user has none
      if (workspaces.length === 0) {
        await createWorkspace(workspaceData);
      }
      
      // TODO: Save preferences to backend
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace");
      setIsCreatingWorkspace(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PM Tools, {user?.firstName}!</h1>
          <p className="text-muted-foreground">
            Let's get you set up in just a few quick steps
          </p>
        </div>

        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-8">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Role */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">What's your role?</h2>
              <div className="grid gap-3">
                {["Product Manager", "Product Owner", "Growth PM", "Technical PM", "Other"].map(
                  (role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setPreferences({ ...preferences, role });
                        setStep(2);
                      }}
                      className={`p-4 border rounded-lg hover:bg-accent transition-colors text-left ${
                        preferences.role === role ? "border-primary" : "border-border"
                      }`}
                    >
                      {role}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">How experienced are you with A/B testing?</h2>
              <div className="grid gap-3">
                {[
                  { level: "Beginner", desc: "Just getting started" },
                  { level: "Intermediate", desc: "Run a few experiments" },
                  { level: "Advanced", desc: "Regular experimenter" },
                  { level: "Expert", desc: "A/B testing veteran" },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setPreferences({ ...preferences, experience: item.level });
                      setStep(workspaces.length === 0 ? 3 : 4);
                    }}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors text-left ${
                      preferences.experience === item.level ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="font-medium">{item.level}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">What are your main goals?</h2>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid gap-3">
                {[
                  "Run more successful experiments",
                  "Save time on documentation",
                  "Learn best practices",
                  "Improve hypothesis quality",
                  "Collaborate better with team",
                ].map((goal) => (
                  <label
                    key={goal}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                      preferences.goals.includes(goal) ? "border-primary" : "border-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={preferences.goals.includes(goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            goals: [...preferences.goals, goal],
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            goals: preferences.goals.filter((g) => g !== goal),
                          });
                        }
                      }}
                    />
                    {goal}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (workspaces.length === 0) {
                    setStep(4);
                  } else {
                    handleComplete();
                  }
                }}
                disabled={preferences.goals.length === 0}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {workspaces.length === 0 ? "Continue" : "Complete Setup"}
              </button>
            </div>
          )}

          {/* Step 4: Create Workspace */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Create your workspace</h2>
                <p className="text-sm text-muted-foreground">
                  A workspace is where you and your team collaborate on experiments
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="workspace-name" className="block text-sm font-medium mb-2">
                    Workspace name
                  </label>
                  <input
                    id="workspace-name"
                    type="text"
                    value={workspaceData.name}
                    onChange={(e) => {
                      setWorkspaceData({ ...workspaceData, name: e.target.value });
                      setError(null);
                    }}
                    placeholder="e.g., Acme Inc, Product Team"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="workspace-desc" className="block text-sm font-medium mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    id="workspace-desc"
                    value={workspaceData.description}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, description: e.target.value })}
                    placeholder="What does your team work on?"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleComplete}
                disabled={!workspaceData.name || isCreatingWorkspace}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingWorkspace ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating workspace...
                  </>
                ) : (
                  "Create Workspace & Complete Setup"
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}