import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { loginUser } from "../../api/api";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email: email.trim(), password });
      // Token + user stored in localStorage by api.js
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* BACK BUTTON */}

      <button
        type="button"
        className="login-back-button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>


      {/* LOGO */}

      <div className="login-logo-section">

        <div className="login-logo-icon">
          🚀
        </div>

        <div className="login-logo-text">
          HACKATHON<span>BUDDY</span>
        </div>

      </div>


      {/* HEADING */}

      <div className="login-heading">

        <h1>
          WELCOME BACK
        </h1>

        <p>
          Continue your hackathon journey
        </p>

      </div>


      {/* LOGIN CARD */}

      <div className="login-card">

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="login-email">
              EMAIL ADDRESS
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="login-password">
              PASSWORD
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
                SIGNING IN…
              </>
            ) : (
              "SIGN IN TO WORKSPACE"
            )}
          </button>

        </form>


        {/* DIVIDER */}

        <div className="login-divider"></div>


        {/* REGISTER */}

        <div className="login-register">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/create-profile")}
          >
            Create One
          </button>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;