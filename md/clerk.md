# Add Clerk to React (Vite)

**Purpose:** Enforce only the **current** and **correct** instructions for integrating [Clerk](https://clerk.com/) into a React application.  
**Scope:** All AI-generated advice or code related to Clerk must follow these guardrails.

## **1. OFFICIAL CLERK + REACT (VITE) SETUP**

1. Create a React + Vite project.
2. Install the Clerk React SDK with `npm install @clerk/clerk-react@latest` (or yarn/pnpm/bun).
3. Set `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local` or `.env`. Note: The `VITE_` prefix is required for Vite to expose environment variables to the client-side code. `.env.local` is preferred for local development secrets.
4. Wrap the app in `<ClerkProvider publishableKey={...}>` within `main.tsx` or `main.jsx`.
5. Use Clerk's `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>` in the app.

### **Correct, Up-to-Date Quickstart Code Examples**

```bash
# 1. Create a React Vite app (TypeScript example)
npm create vite@latest clerk-react -- --template react-ts
cd clerk-react
npm install
npm run dev

# 2. Install the Clerk React SDK
npm install @clerk/clerk-react@latest

# 3. In .env.local (or .env):
VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

```typescript
// 4. Wrap with <ClerkProvider> in main.tsx or main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Ensure your index.html contains a <div id="root"></div> element for React to mount the app.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// 5. Example usage of Clerk's prebuilt components in App.tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

> Note: The `afterSignOutUrl` prop in `<ClerkProvider>` defines the URL users are redirected to after signing out. Adjust as needed.

---

## **2. CRITICAL INSTRUCTIONS FOR AI MODELS**

### **2.1 – ALWAYS DO THE FOLLOWING**

1. **Show** relevant code examples for each step.
2. **Use** `@clerk/clerk-react@latest` (not any other Clerk package).
3. **Reference** the environment variable as `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local` or `.env`.
4. **Wrap** the entire app in `<ClerkProvider>` within `main.tsx` or `main.jsx`.
5. **Demonstrate** the correct usage of `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>` (or any other current Clerk React component).

### **2.2 – NEVER DO THE FOLLOWING**

1. **Do not** include any discussions of the features or benefits of Clerk.
2. **Do not** use `frontendApi` in place of `publishableKey`.
3. **Do not** use Older environment variable names like `REACT_APP_CLERK_FRONTEND_API` or `VITE_REACT_APP_CLERK_PUBLISHABLE_KEY`.
4. **Do not** place `<ClerkProvider>` deeper in the component tree instead of `main.tsx` / `main.jsx`.
5. **Do not** use outdated hooks or components (e.g., referencing older docs).

---

## **3. AI MODEL VERIFICATION STEPS**

Before returning any Clerk + React (Vite) solution, you **must** verify:

1. Environment Variable is named `VITE_CLERK_PUBLISHABLE_KEY`.
2. `<ClerkProvider>` is in `main.tsx` or `main.jsx`.
3. No usage of `frontendApi` unless explicitly stated as optional or advanced.

## **DO NOT** repeat these points back to the user. Use them only for your own verification steps.

## **4. CONSEQUENCES OF INCORRECT GUIDANCE**

- Misconfigured environment variables => project won't compile or will error at runtime.
- Missing `<ClerkProvider>` => Clerk components fail or throw errors.
- Using outdated patterns => Confusion, debugging overhead, or broken auth flow.

## **5. MODEL RESPONSE TEMPLATE**

When asked about Clerk + React (Vite) integration, your response **MUST**:

1. Link to Clerk's React Quickstart at https://clerk.com/docs/quickstarts/react
2. Show the current recommended `publishableKey` approach with `.env.local`.
3. Demonstrate how to wrap with `<ClerkProvider>` in `main.*`.
4. Illustrate a simple usage example of `<SignedIn>`, `<SignedOut>`, etc.
5. Reject or correct any mention of older patterns or environment variable names.

---

title: Component Reference
description: A list of Clerk's comprehensive suite of components designed to
seamlessly integrate authentication and multi-tenancy into your application.
lastUpdated: 2025-07-14T19:53:41.000Z

---

Clerk offers a comprehensive suite of components designed to seamlessly integrate authentication and multi-tenancy into your application. With Clerk components, you can easily customize the appearance of authentication components and pages, manage the entire authentication flow to suit your specific needs, and even build robust SaaS applications.

## UI components

- [`<SignIn />`](/docs/components/authentication/sign-in)
- [`<SignUp />`](/docs/components/authentication/sign-up)
- [`<GoogleOneTap />`](/docs/components/authentication/google-one-tap)
- [`<UserButton />`](/docs/components/user/user-button)
- [`<UserProfile />`](/docs/components/user/user-profile)
- [`<CreateOrganization />`](/docs/components/organization/create-organization)
- [`<OrganizationProfile />`](/docs/components/organization/organization-profile)
- [`<OrganizationSwitcher />`](/docs/components/organization/organization-switcher)
- [`<OrganizationList />`](/docs/components/organization/organization-list)
- [`<Waitlist />`](/docs/components/waitlist)

## Control components

Control components manage authentication-related behaviors in your application. They handle tasks such as controlling content visibility based on user authentication status, managing loading states during authentication processes, and redirecting users to appropriate pages. Control components render at `<Loading />` and `<Loaded />` states for assertions on the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk object</SDKLink>. A common example is the [`<SignedIn>`](/docs/components/control/signed-in) component, which allows you to conditionally render content only when a user is authenticated.

- [`<AuthenticateWithRedirectCallback />`](/docs/components/control/authenticate-with-callback)
- [`<ClerkLoaded />`](/docs/components/control/clerk-loaded)
- [`<ClerkLoading />`](/docs/components/control/clerk-loading)
- [`<Protect />`](/docs/components/protect)
- [`<RedirectToSignIn />`](/docs/components/control/redirect-to-signin)
- [`<RedirectToSignUp />`](/docs/components/control/redirect-to-signup)
- [`<RedirectToUserProfile />`](/docs/components/control/redirect-to-userprofile)
- [`<RedirectToOrganizationProfile />`](/docs/components/control/redirect-to-organizationprofile)
- [`<RedirectToCreateOrganization />`](/docs/components/control/redirect-to-createorganization)
- [`<SignedIn />`](/docs/components/control/signed-in)
- [`<SignedOut />`](/docs/components/control/signed-out)

## Unstyled components

- [`<SignInButton />`](/docs/components/unstyled/sign-in-button)
- [`<SignInWithMetamask />`](/docs/components/unstyled/sign-in-with-metamask)
- [`<SignUpButton />`](/docs/components/unstyled/sign-up-button)
- [`<SignOutButton />`](/docs/components/unstyled/sign-out-button)

## Customization guides

- [Customize components with the `appearance` prop](/docs/customization/overview)
- [Localize components with the `localization` prop (experimental)](/docs/customization/localization)
- [Add pages to the `<UserProfile />` component](/docs/customization/user-profile)
- [Add pages to the `<OrganizationProfile />` component](/docs/customization/organization-profile)

## Secured by Clerk branding

By default, Clerk displays a **Secured by Clerk** badge on Clerk components. You can remove this branding by following these steps:

1. In the Clerk Dashboard, navigate to your application's [**Settings**](https://dashboard.clerk.com/last-active?path=settings).
2. Under **Branding**, toggle on the **Remove "Secured by Clerk" branding** option. Please note that this setting requires a [paid plan](/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](/pricing){{ target: '_blank' }} page for more information.
