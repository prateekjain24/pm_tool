import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicHeader } from "./components/layout/PublicHeader";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Onboarding } from "./pages/Onboarding";
import { LogoDemo } from "./pages/LogoDemo";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-background">
              <PublicHeader />
              <div className="pt-16">
                <Landing />
              </div>
            </div>
          }
        />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/logo-demo" element={<LogoDemo />} />

        {/* Onboarding route (no dashboard layout) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Protected routes with dashboard layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/hypotheses" element={<div className="p-6"><h1 className="text-2xl font-bold">Hypotheses</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
          <Route path="/experiments" element={<div className="p-6"><h1 className="text-2xl font-bold">Experiments</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
          <Route path="/documents" element={<div className="p-6"><h1 className="text-2xl font-bold">Documents</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
          <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
