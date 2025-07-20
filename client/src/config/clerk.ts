/**
 * Clerk configuration for the PM Tools application
 */

export const clerkConfig = {
  // Appearance customization
  appearance: {
    elements: {
      rootBox: "mx-auto",
      card: "bg-background shadow-xl",
      headerTitle: "text-2xl font-bold",
      headerSubtitle: "text-muted-foreground",
      formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
      formFieldInput: "bg-background border-input",
      footerActionLink: "text-primary hover:text-primary/80",
    },
    variables: {
      colorPrimary: "#3b82f6", // Tailwind blue-500
      colorText: "#0f172a", // Tailwind slate-900
      colorTextSecondary: "#64748b", // Tailwind slate-500
      colorBackground: "#ffffff",
      colorInputBackground: "#f8fafc", // Tailwind slate-50
      colorInputText: "#0f172a",
      borderRadius: "0.5rem",
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  },

  // Sign-in redirect
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/onboarding",
};
