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
import Editor from "./pages/Editor";
import Settings from "./pages/Settings";
import PublicPortfolio from "./pages/PublicPortfolio";
import Activity from "./pages/Activity";
import SkillTree from "./pages/SkillTree";
import CodeReview from "./pages/CodeReview";
import Mentor from "./pages/Mentor";
import Collaborate from "./pages/Collaborate";
import { Toaster } from "react-hot-toast";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
              </Route>

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
                <Route path="/code-review" element={<CodeReview />} />
                <Route path="/mentor" element={<Mentor />} />
                <Route path="/collaborate" element={<Collaborate />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/portfolio" element={<Editor />} />
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
    </ErrorBoundary>
  );
}

export default App;
