import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

export function PublicHeader() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to={isSignedIn ? "/dashboard" : "/"}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="md" showText animated />
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
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
