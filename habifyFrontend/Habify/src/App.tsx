// import { Toaster } from "@/components/ui/sonner";
import { Toaster } from "sonner";

// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppProvider, useApp } from "@/contexts/AppContext";

// Onboarding flow pages
import Onboarding from "./pages/Onboarding";
import StreakIntro from "./pages/StreakIntro";
import CreateHabit from "./pages/CreateHabit";

// App feature pages
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import GroupDetails from "./pages/GroupDetails";   // ✅ ADD THIS
import NotFound from "./pages/NotFound";
import Achievements from "./pages/Achievements";
import Shop from "@/pages/Shop";



const queryClient = new QueryClient();

// ----------------------
// Protected Route Wrapper
// ----------------------
const ProtectedRoute = ({ children }) => {
  const { profile } = useApp();
  return profile ? children : <Navigate to="/onboarding" replace />;
};

// ----------------------
// App Component
// ----------------------
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        {/* <Sonner /> */}

        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/streak-intro" element={<StreakIntro />} />
            <Route path="/create-habit" element={<CreateHabit />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quests"
              element={
                <ProtectedRoute>
                  <Quests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: GROUP DETAILS PAGE */}
            <Route
              path="/groups/:id"
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
            }
          />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            <Route path="/shop" element={<Shop />} />

            {/* DEFAULT: redirect home → onboarding */}
            <Route path="/" element={<Navigate to="/onboarding" replace />} />

            {/* 404 PAGE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;