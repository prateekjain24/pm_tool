import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector";

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - hidden on dashboard pages */}
          <Link to={isSignedIn ? "/dashboard" : "/"} className="hover:opacity-80 transition-opacity lg:hidden">
            <Logo size="md" showText animated />
          </Link>
          <div className="hidden lg:block" />

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <WorkspaceSelector />
                <div className="w-px h-6 bg-border" />
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName || "User"}
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
