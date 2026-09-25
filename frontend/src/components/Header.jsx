import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  Brain,
  FolderKanban,
  MessageSquare,
  Bell,
  User,
  ArrowLeft,
  Search,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Header.css";

function Header() {
  const { currentUser, notifications, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isDashboard = location.pathname === "/dashboard";
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/create-profile";

  if (isAuthPage) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Hackathons", icon: Trophy, path: "/hackathons" },
    { label: "Teams", icon: Users, path: "/teams" },
    { label: "AI Hub", icon: Brain, path: "/ai-hub" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: unreadCount },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky-header">
      <div className="header-container">
        {/* Brand & Left Actions */}
        <div className="header-left-section">
          <Link to="/dashboard" className="header-brand">
            <div className="brand-icon-box">🚀</div>
            <div className="brand-text">
              HACKATHON<span>BUDDY</span>
            </div>
          </Link>

          {/* BACK TO DASHBOARD BUTTON */}
          {!isDashboard && (
            <button
              className="back-to-dashboard-btn"
              onClick={() => navigate("/dashboard")}
              title="Return to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="header-right-section">
          {/* Quick Notification Icon */}
          <Link
            to="/notifications"
            className="icon-action-btn"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="action-badge">{unreadCount}</span>}
          </Link>

          {/* Quick Chat Icon */}
          <Link to="/chat" className="icon-action-btn" title="Messages">
            <MessageSquare size={19} />
          </Link>

          {/* User Profile Pill */}
          <div className="user-profile-menu">
            <button
              className="user-profile-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-label="User menu"
            >
              <div className="user-avatar-small">
                {currentUser?.firstName?.charAt(0) || currentUser?.fullName?.charAt(0) || "U"}
              </div>
              <div className="user-text-info">
                <span className="user-name-text">
                  {currentUser?.firstName || currentUser?.fullName?.split(" ")[0] || "User"}
                </span>
                <span className="user-role-text">
                  {currentUser?.primaryRole || currentUser?.role || "Developer"}
                </span>
              </div>
              <ChevronDown size={14} className="dropdown-caret" />
            </button>

            {userDropdownOpen && (
              <div
                className="user-dropdown-card"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="dropdown-header">
                  <strong>{currentUser?.fullName}</strong>
                  <small>{currentUser?.email}</small>
                </div>
                <div className="dropdown-divider" />
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <User size={16} />
                  My Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/admin"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                  style={{ color: "#38bdf8" }}
                >
                  <Sparkles size={16} />
                  Admin Console
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {!isDashboard && (
            <button
              className="mobile-back-dashboard"
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>
          )}

          <div className="mobile-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </Link>
              );
            })}
          </div>

          <div className="mobile-drawer-footer">
            <div className="mobile-user-row">
              <div className="user-avatar-small">
                {currentUser?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <strong>{currentUser?.fullName}</strong>
                <small>{currentUser?.email}</small>
              </div>
            </div>
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
