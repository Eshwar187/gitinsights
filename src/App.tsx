import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PublicLayout from "./layouts/PublicLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/p/:username" element={<PublicPortfolio />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<AppLayout />}>
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
  );
}

export default App;
