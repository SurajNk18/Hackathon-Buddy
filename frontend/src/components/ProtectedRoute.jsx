import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

/**
 * ProtectedRoute — wraps a page component to enforce role-based access.
 *
 * Props:
 *   - children:       The component to render if authorized
 *   - allowedRoles:   Array of role strings that can access this route
 *                     e.g. ["SUPER_ADMIN", "HACKATHON_ADMIN"]
 *   - requireAuth:    (default true) Whether the user must be logged in
 *   - redirectTo:     Where to redirect unauthorized users (default "/login")
 */
function ProtectedRoute({ children, allowedRoles = [], requireAuth = true, redirectTo = "/login" }) {
  const { currentUser, isLoggedIn } = useApp();

  // Not logged in → redirect to login
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If there are allowedRoles, check user's role
  if (allowedRoles.length > 0 && currentUser) {
    const userRole = (currentUser.role || "STUDENT").toUpperCase();

    // Normalize: remove "ROLE_" prefix if present
    const normalizedRole = userRole.replace("ROLE_", "");

    // Map unrecognized or display roles to STUDENT as a safe default
    const validRoles = ["SUPER_ADMIN", "HACKATHON_ADMIN", "DEVELOPER_ADMIN", "ADMIN", "STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY"];
    let finalRole = normalizedRole;
    if (!validRoles.includes(finalRole)) {
      finalRole = "STUDENT"; // Safe default if backend gave a display role by mistake
    }



    // Check if user's role is in the allowed list
    const isAllowed = allowedRoles.some(
      (r) => r.toUpperCase().replace("ROLE_", "") === finalRole
    );

    if (!isAllowed) {
      // Redirect to their proper dashboard based on role
      const roleRedirects = {
        SUPER_ADMIN: "/super-admin/dashboard",
        HACKATHON_ADMIN: "/admin/hackathons/dashboard",
        DEVELOPER_ADMIN: "/admin/developers/dashboard",
        ADMIN: "/admin",
        STUDENT: "/student/dashboard",
      };
      const fallback = roleRedirects[finalRole] || "/student/dashboard";
      
      // Prevent infinite redirect loops!
      if (window.location.pathname === fallback) {
        // If they aren't allowed here but fallback says go here, 
        // just log them out or show an error to break the loop.
        localStorage.removeItem("hackathon_token");
        return <Navigate to="/login" replace />;
      }
      
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
