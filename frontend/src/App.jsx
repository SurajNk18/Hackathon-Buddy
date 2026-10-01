import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import CreateProfile from "./pages/CreateProfile/CreateProfile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Hackathon from "./pages/Hackathon/Hackathon";
import Teams from "./pages/Teams/Teams";
import AIHub from "./pages/AIHub/AIHub";
import Projects from "./pages/Projects/Projects";
import Chat from "./pages/Chat/Chat";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import HackathonAdminDashboard from "./pages/HackathonAdmin/HackathonAdminDashboard";
import DeveloperAdminDashboard from "./pages/DeveloperAdmin/DeveloperAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          {/* ─── PUBLIC ROUTES ───────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-profile" element={<CreateProfile />} />

          {/* ─── STUDENT DASHBOARD ───────────────────── */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

          {/* ─── SUPER ADMIN DASHBOARD ───────────────── */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />

          {/* ─── HACKATHON ADMIN DASHBOARD ────────────── */}
          <Route
            path="/admin/hackathons/dashboard"
            element={
              <ProtectedRoute allowedRoles={["HACKATHON_ADMIN", "SUPER_ADMIN"]}>
                <HackathonAdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route path="/hackathon-admin" element={<Navigate to="/admin/hackathons/dashboard" replace />} />

          {/* ─── DEVELOPER ADMIN DASHBOARD ────────────── */}
          <Route
            path="/admin/developers/dashboard"
            element={
              <ProtectedRoute allowedRoles={["DEVELOPER_ADMIN", "SUPER_ADMIN"]}>
                <DeveloperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ─── LEGACY ADMIN DASHBOARD ──────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "HACKATHON_ADMIN", "DEVELOPER_ADMIN", "SUPER_ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ─── AUTHENTICATED USER ROUTES ───────────── */}
          <Route path="/hackathons" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Hackathon /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Teams /></ProtectedRoute>} />
          <Route path="/matching" element={<Navigate to="/teams" replace />} />
          <Route path="/ai-hub" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><AIHub /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Projects /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Chat /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY", "ADMIN", "HACKATHON_ADMIN", "DEVELOPER_ADMIN", "SUPER_ADMIN"]}><Profile /></ProtectedRoute>} />
          <Route path="/registrations" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Hackathon /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"]}><Hackathon /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY", "ADMIN", "HACKATHON_ADMIN", "DEVELOPER_ADMIN", "SUPER_ADMIN"]}><Profile /></ProtectedRoute>} />

          {/* ─── CATCH ALL ───────────────────────────── */}
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default App;