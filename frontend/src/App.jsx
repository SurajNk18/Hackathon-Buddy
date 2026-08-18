import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import CreateProfile from "./pages/CreateProfile/CreateProfile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Hackathon from "./pages/Hackathon/Hackathon";
import Teams from "./pages/Teams/Teams";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/create-profile"
        element={<CreateProfile />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/hackathons"
        element={<Hackathon />}
      />

       <Route
    path="/teams"
    element={<Teams />}
  />

    </Routes>
  );
}

export default App;