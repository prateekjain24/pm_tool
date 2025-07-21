import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { PublicHeader } from "./components/layout/PublicHeader";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { LogoDemo } from "./pages/LogoDemo";
import { Onboarding } from "./pages/Onboarding";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import Admin from "./pages/Admin";
import AcceptInvitation from "./pages/AcceptInvitation";
import Team from "./pages/Team";
import { Hypotheses } from "./pages/Hypotheses";

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
        <Route path="/invitation/accept" element={<AcceptInvitation />} />

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
          <Route path="/hypotheses" element={<Hypotheses />} />
          <Route
            path="/experiments"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Experiments</h1>
                <p className="text-muted-foreground mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/documents"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-muted-foreground mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/team" element={<Team />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
