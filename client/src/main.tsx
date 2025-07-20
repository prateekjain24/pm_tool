import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { clerkConfig } from "./config/clerk";
import { initSentry } from "./config/sentry";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";

// Initialize Sentry before anything else
initSentry();

// Get Clerk publishable key from environment
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={publishableKey}
        appearance={clerkConfig.appearance}
        signInUrl={clerkConfig.signInUrl}
        signUpUrl={clerkConfig.signUpUrl}
        afterSignInUrl={clerkConfig.afterSignInUrl}
        afterSignUpUrl={clerkConfig.afterSignUpUrl}
      >
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
);
