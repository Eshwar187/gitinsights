import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import PublicLayout from "./layouts/PublicLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import AuthCallback from "./pages/Auth/Callback";
import Analytics from "./pages/Analytics";
import Repositories from "./pages/Repositories";
import Settings from "./pages/Settings";
import PublicPortfolio from "./pages/PublicPortfolio";
import Activity from "./pages/Activity";
import SkillTree from "./pages/SkillTree";
import DeveloperDNA from "./pages/DeveloperDNA";
import GitHubWrapped from "./pages/GitHubWrapped";
import Achievements from "./pages/Achievements";
import CompareStats from "./pages/CompareStats";
import TimeMachine from "./pages/TimeMachine";
import ProfileCard from "./pages/ProfileCard";
import RepoHealth from "./pages/RepoHealth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { Toaster } from "react-hot-toast";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/p/:username" element={<PublicPortfolio />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
              </Route>

              {/* Admin Routes - Hidden from main navigation */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Protected Dashboard Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/skills" element={<SkillTree />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/dna" element={<DeveloperDNA />} />
                <Route path="/wrapped" element={<GitHubWrapped />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/compare" element={<CompareStats />} />
                <Route path="/time-machine" element={<TimeMachine />} />
                <Route path="/profile-card" element={<ProfileCard />} />
                <Route path="/repo-health" element={<RepoHealth />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
