import { UserProfile } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Profile() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for profile page */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Account Settings</h1>
          </div>
        </div>
      </div>

      {/* Clerk UserProfile component */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-border",
              navbar: "hidden md:flex",
              pageScrollBox: "px-4 md:px-8",
              profileSection: "px-0",
            },
          }}
        />
      </div>
    </div>
  );
}
