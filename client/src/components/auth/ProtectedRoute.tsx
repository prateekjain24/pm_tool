import { useAuth } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
