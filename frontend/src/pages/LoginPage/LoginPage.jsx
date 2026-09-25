import React, { useState } from "react";
import {
  ArrowRight,
  Rocket,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(email.trim(), password.trim());

      if (result.success) {
        if (result.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
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
                      "Password recovery will be available soon."
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
              disabled={loading}
            >
              <span>{loading ? "SIGNING IN..." : "SIGN IN TO WORKSPACE"}</span>

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