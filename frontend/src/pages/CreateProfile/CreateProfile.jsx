import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { registerUser } from "../../api/api";
import "./CreateProfile.css";

// Strong-password regex matching the backend's @Pattern
// Requires: uppercase, lowercase, digit, special char (@$!%*?&), min 8 chars
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function CreateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    primaryRole: "Full Stack",
    techSkills: "",
    projectDomains: "",
    githubUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Client-side validation ─────────────────────────────
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)."
      );
      return;
    }

    // ── Call backend ───────────────────────────────────────
    setLoading(true);
    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Registration success — token + user already stored by api.js
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-page">

      {/* BACK */}
      <button
        className="create-profile-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        type="button"
      >
        <ArrowLeft size={25} />
      </button>


      {/* HEADER */}
      <header className="create-profile-header">

        <div className="create-profile-logo">

          <div className="create-profile-logo-icon">
            🚀
          </div>

          <div className="create-profile-logo-text">
            HACKATHON<span>BUDDY</span>
          </div>

        </div>


        <h1>JOIN THE CLUB</h1>

        <p>
          Create your profile to get matched
        </p>

      </header>


      {/* CARD */}
      <div className="create-profile-card">

        <form onSubmit={handleSubmit}>

          <div className="create-profile-columns">

            {/* =====================
                LEFT COLUMN
            ====================== */}

            <div className="profile-column">

              <h2 className="profile-section-title identity-title">
                IDENTITY
              </h2>


              {/* FIRST NAME */}
              <div className="profile-field">

                <label htmlFor="firstName">
                  FIRST NAME <span style={{ color: "var(--accent-purple, #a855f7)" }}>*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />

              </div>


              {/* LAST NAME */}
              <div className="profile-field">

                <label htmlFor="lastName">
                  LAST NAME <span style={{ color: "var(--accent-purple, #a855f7)" }}>*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />

              </div>


              {/* EMAIL */}
              <div className="profile-field">

                <label htmlFor="email">
                  EMAIL <span style={{ color: "var(--accent-purple, #a855f7)" }}>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>


              {/* PASSWORD */}
              <div className="profile-field">

                <label htmlFor="password">
                  PASSWORD <span style={{ color: "var(--accent-purple, #a855f7)" }}>*</span>
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min 8 chars, A-Z, 0-9, @$!%*?&"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

              </div>


              {/* PRIMARY ROLE */}
              <div className="profile-field">

                <label htmlFor="primaryRole">
                  PRIMARY ROLE
                </label>

                <select
                  id="primaryRole"
                  name="primaryRole"
                  value={formData.primaryRole}
                  onChange={handleChange}
                >
                  <option>Full Stack</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>AI / ML</option>
                  <option>UI / UX</option>
                  <option>DevOps</option>
                </select>

              </div>

            </div>


            {/* =====================
                RIGHT COLUMN
            ====================== */}

            <div className="profile-column">

              <h2 className="profile-section-title stack-title">
                STACK
              </h2>


              {/* TECH SKILLS */}
              <div className="profile-field">

                <label htmlFor="techSkills">
                  TECH SKILLS
                </label>

                <input
                  id="techSkills"
                  name="techSkills"
                  type="text"
                  placeholder="React, Node, Python..."
                  value={formData.techSkills}
                  onChange={handleChange}
                />

              </div>


              {/* PROJECT DOMAINS */}
              <div className="profile-field">

                <label htmlFor="projectDomains">
                  PROJECT DOMAINS
                </label>

                <input
                  id="projectDomains"
                  name="projectDomains"
                  type="text"
                  placeholder="AI, Web3, FinTech..."
                  value={formData.projectDomains}
                  onChange={handleChange}
                />

              </div>


              {/* GITHUB */}
              <div className="profile-field">

                <label htmlFor="githubUrl">
                  GITHUB URL
                </label>

                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={handleChange}
                />

              </div>

              {/* Password hint */}
              <div style={{
                fontSize: "0.72rem",
                color: "#9ca3af",
                lineHeight: 1.5,
                marginTop: "auto",
                paddingTop: "1rem",
              }}>
                <strong style={{ color: "#c4b5fd" }}>Password requirements:</strong>
                <ul style={{ margin: "0.3rem 0 0 1rem", padding: 0 }}>
                  <li>At least 8 characters</li>
                  <li>One uppercase &amp; one lowercase letter</li>
                  <li>One number (0–9)</li>
                  <li>One special character: @$!%*?&amp;</li>
                </ul>
              </div>

            </div>

          </div>


          {/* ERROR */}
          {error && (
            <div className="create-profile-error">
              {error}
            </div>
          )}


          {/* BUTTON */}
          <button
            type="submit"
            className="initialize-profile-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
                CREATING PROFILE…
              </>
            ) : (
              "INITIALIZE PROFILE"
            )}
          </button>


          {/* DIVIDER */}
          <div className="create-profile-divider"></div>


          {/* LOGIN */}
          <div className="already-account">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateProfile;
