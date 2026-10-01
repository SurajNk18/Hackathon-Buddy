import React, { useState } from "react";
import {
  ArrowRight,
  Rocket,
  UserPlus,
  ShieldCheck,
  Crown,
  Shield,
  GraduationCap,
  Code2,
  Trophy,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./LoginPage.css";

const ROLES = [
  {
    id: "STUDENT",
    label: "Student",
    icon: GraduationCap,
    color: "#8b5cf6",
    desc: "Browse hackathons, register, build projects",
    redirect: "/student/dashboard"
  },
  {
    id: "ADMIN",
    label: "Admin",
    icon: Shield,
    color: "#3b82f6",
    desc: "Choose admin type after selection",
    redirect: "/admin",
    subRoles: [
      { id: "HACKATHON_ADMIN", label: "Hackathon Admin", icon: Trophy, color: "#14b8a6", desc: "Manage hackathons & participants", redirect: "/admin/hackathons/dashboard" },
      { id: "DEVELOPER_ADMIN", label: "Developer Admin", icon: Code2, color: "#6366f1", desc: "Manage developer profiles & activity", redirect: "/admin/developers/dashboard" },
    ]
  },
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    icon: Crown,
    color: "#e11d48",
    desc: "Full platform control & credential management",
    redirect: "/super-admin/dashboard"
  }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [selectedSubRole, setSelectedSubRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentRole = ROLES.find(r => r.id === selectedRole);
  const showSubRoles = selectedRole === "ADMIN";

  // Determine the effective role (sub-role for Admin, or main role)
  const effectiveRole = showSubRoles && selectedSubRole
    ? selectedSubRole
    : selectedRole;

  // Get the redirect path based on selected role
  const getRedirectPath = (userRole) => {
    const role = (userRole || effectiveRole).toUpperCase();
    switch (role) {
      case "SUPER_ADMIN": return "/super-admin/dashboard";
      case "HACKATHON_ADMIN": return "/admin/hackathons/dashboard";
      case "DEVELOPER_ADMIN": return "/admin/developers/dashboard";
      case "ADMIN": return "/admin";
      default: return "/student/dashboard";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate admin sub-role selection
    if (selectedRole === "ADMIN" && !selectedSubRole) {
      setError("Please select an admin type (Hackathon Admin or Developer Admin).");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email.trim(), password.trim());

      if (result.success) {
        const userRole = result.user?.role || "";
        const redirectPath = getRedirectPath(userRole);
        navigate(redirectPath);
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* BACKGROUND DECORATION */}
      <div className="login-bg-glow login-bg-glow-one"></div>
      <div className="login-bg-glow login-bg-glow-two"></div>

      {/* MAIN CONTENT */}
      <section className="login-container">

        {/* BRAND */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Rocket size={28} strokeWidth={2.2} />
          </div>
          <div className="login-brand-name">
            HACKATHON<span>BUDDY</span>
          </div>
        </div>

        {/* HEADING */}
        <div className="login-heading">
          <div className="login-badge">
            <ShieldCheck size={15} />
            <span>SECURE WORKSPACE ACCESS</span>
          </div>
          <h1>WELCOME <span>BACK</span></h1>
          <p>
            Sign in to continue building teams, discovering
            hackathons, and creating amazing projects.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">

          <div className="login-card-header">
            <h2>Sign in to your account</h2>
            <p>Select your role and enter credentials</p>
          </div>

          {/* ───────── ROLE SELECTOR ───────── */}
          <div className="role-selector">
            <label className="role-selector-label">LOGIN AS</label>
            <div className="role-options">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    className={`role-option ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedSubRole(null);
                      setError("");
                    }}
                    style={{ "--role-color": role.color }}
                  >
                    <div className="role-option-icon">
                      <Icon size={20} />
                    </div>
                    <div className="role-option-text">
                      <strong>{role.label}</strong>
                      <small>{role.desc}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ───────── ADMIN SUB-ROLE ───────── */}
          {showSubRoles && (
            <div className="sub-role-selector">
              <label className="role-selector-label">ADMIN TYPE</label>
              <div className="sub-role-options">
                {ROLES.find(r => r.id === "ADMIN").subRoles.map((sub) => {
                  const SubIcon = sub.icon;
                  const isActive = selectedSubRole === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`sub-role-option ${isActive ? "active" : ""}`}
                      onClick={() => { setSelectedSubRole(sub.id); setError(""); }}
                      style={{ "--role-color": sub.color }}
                    >
                      <SubIcon size={18} />
                      <div>
                        <strong>{sub.label}</strong>
                        <small>{sub.desc}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-field">
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="username"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">PASSWORD</label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setError("Password recovery will be available soon.")}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">{error}</div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
              style={{ "--btn-color": currentRole?.color || "#8b5cf6" }}
            >
              <span>{loading ? "SIGNING IN..." : `SIGN IN AS ${(showSubRoles && selectedSubRole ? ROLES.find(r => r.id === "ADMIN").subRoles.find(s => s.id === selectedSubRole)?.label : currentRole?.label || "User").toUpperCase()}`}</span>
              <ArrowRight size={19} />
            </button>

          </form>

          {/* DIVIDER */}
          <div className="login-divider"><span>OR</span></div>

          {/* CREATE ACCOUNT (Students only) */}
          <div className="create-account-section">
            <div className="create-account-text">
              <h3>New to HackathonBuddy?</h3>
              <p>Create your developer profile and start finding the right hackathon team.</p>
            </div>
            <button
              type="button"
              className="create-account-button"
              onClick={() => navigate("/create-profile")}
            >
              <UserPlus size={18} />
              <span>CREATE STUDENT ACCOUNT</span>
            </button>
          </div>

        </div>

        {/* FOOTER */}
        <p className="login-footer">
          HackathonBuddy • Build. Match. Ship.
        </p>

      </section>
    </main>
  );
};

export default LoginPage;