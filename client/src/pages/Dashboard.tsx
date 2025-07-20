import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { user } = useUser();

  return (
    <div className="container max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "there"}!</h1>
        <p className="text-muted-foreground">Ready to create your next winning experiment?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              type="button"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-left"
            >
              Create New Hypothesis
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-left"
            >
              View Past Experiments
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-left"
            >
              Generate PRD
            </button>
            <Link
              to="/profile"
              className="block w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-left"
            >
              Account Settings
            </Link>
          </div>
        </div>

        {/* Recent Hypotheses */}
        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Hypotheses</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              No hypotheses yet. Create your first one!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Experiments</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Time Saved</span>
              <span className="font-semibold">0 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
