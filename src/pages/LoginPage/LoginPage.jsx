import React, { useState } from "react";
import {
  ArrowRight,
  Rocket,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const ADMIN_EMAIL = "admin@hackathonbuddy.com";
const ADMIN_PASSWORD = "admin123";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    if (
      enteredEmail === ADMIN_EMAIL &&
      enteredPassword === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: "ADMIN-001",
        name: "Hackathon Admin",
        email: ADMIN_EMAIL,
        role: "ADMIN",
      };

      localStorage.setItem(
        "hackathon_current_user",
        JSON.stringify(adminUser)
      );

      navigate("/admin");
      return;
    }

    // ==========================================
    // NORMAL USER LOGIN
    // ==========================================

    const users = JSON.parse(
      localStorage.getItem("hackathon_users") || "[]"
    );

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === enteredEmail &&
        item.password === enteredPassword
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    const loggedInUser = {
      ...user,
      role: user.role || "USER",
    };

    localStorage.setItem(
      "hackathon_current_user",
      JSON.stringify(loggedInUser)
    );

    navigate("/dashboard");
  };

  return (
    <main className="login-page">

      {/* BACKGROUND DECORATION */}
      <div className="login-bg-glow login-bg-glow-one"></div>
      <div className="login-bg-glow login-bg-glow-two"></div>

      {/* MAIN CONTENT */}
      <section className="login-container">

        {/* =====================================
            BRAND
        ====================================== */}

        <div className="login-brand">

          <div className="login-brand-icon">
            <Rocket size={28} strokeWidth={2.2} />
          </div>

          <div className="login-brand-name">
            HACKATHON<span>BUDDY</span>
          </div>

        </div>

        {/* =====================================
            HEADING
        ====================================== */}

        <div className="login-heading">

          <div className="login-badge">
            <ShieldCheck size={15} />
            <span>SECURE WORKSPACE ACCESS</span>
          </div>

          <h1>
            WELCOME <span>BACK</span>
          </h1>

          <p>
            Sign in to continue building teams, discovering
            hackathons, and creating amazing projects.
          </p>

        </div>

        {/* =====================================
            LOGIN CARD
        ====================================== */}

        <div className="login-card">

          <div className="login-card-header">

            <h2>Sign in to your account</h2>

            <p>
              Enter your credentials to access your workspace.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-field">

              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

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

                <label htmlFor="password">
                  PASSWORD
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError(
                      "Password recovery will be available after backend authentication is added."
                    )
                  }
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
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit"
            >
              <span>SIGN IN TO WORKSPACE</span>

              <ArrowRight size={19} />
            </button>

          </form>

          {/* DIVIDER */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* CREATE ACCOUNT */}
          <div className="create-account-section">

            <div className="create-account-text">

              <h3>New to HackathonBuddy?</h3>

              <p>
                Create your developer profile and start
                finding the right hackathon team.
              </p>

            </div>

            <button
              type="button"
              className="create-account-button"
              onClick={() => navigate("/create-profile")}
            >
              <UserPlus size={18} />

              <span>CREATE ACCOUNT</span>
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