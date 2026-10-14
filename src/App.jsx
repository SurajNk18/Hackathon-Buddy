import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";

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

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/hackathons" element={<Hackathon />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/matching" element={<Navigate to="/teams" replace />} />
          <Route path="/ai-hub" element={<AIHub />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registrations" element={<Hackathon />} />
          <Route path="/calendar" element={<Hackathon />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default App;