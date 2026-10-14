import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import "./CreateProfile.css";

function CreateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    primaryRole: "Full Stack Developer",
    techSkills: "",
    projectDomains: "",
    githubUrl: "",
    location: "India",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.techSkills.trim()
    ) {
      setError(
        "Please fill all required fields (Full Name, Email, Password, Skills)."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const email = formData.email.trim().toLowerCase();

    // ------------------------------------------
    // GET EXISTING USERS
    // ------------------------------------------

    const existingUsers = JSON.parse(
      localStorage.getItem("hackathon_users") || "[]"
    );

    // ------------------------------------------
    // CHECK DUPLICATE EMAIL
    // ------------------------------------------

    const existingUser = existingUsers.find(
      (user) => user.email?.toLowerCase() === email
    );

    if (existingUser) {
      setError(
        "An account with this email already exists. Please sign in."
      );
      return;
    }

    // ------------------------------------------
    // CREATE NEW USER
    // ------------------------------------------

    const newUser = {
      id: `USR-${Date.now()}`,

      name: formData.fullName.trim(),

      email: email,

      password: formData.password,

      role: "USER",

      primaryRole: formData.primaryRole,

      techSkills: formData.techSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      projectDomains: formData.projectDomains
        .split(",")
        .map((domain) => domain.trim())
        .filter(Boolean),

      githubUrl: formData.githubUrl.trim(),

      location: formData.location.trim(),

      createdAt: new Date().toISOString(),
    };

    // ------------------------------------------
    // SAVE USER
    // ------------------------------------------

    existingUsers.push(newUser);

    localStorage.setItem(
      "hackathon_users",
      JSON.stringify(existingUsers)
    );

    // ------------------------------------------
    // SHOW SUCCESS
    // ------------------------------------------

    setSuccess(true);

    // ------------------------------------------
    // GO TO LOGIN PAGE
    // ------------------------------------------

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="create-profile-page">

      {/* BACK BUTTON */}
      <button
        className="create-profile-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
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
          Create your developer profile to match with top hackathon teams
        </p>

      </header>

      {/* CARD */}
      <div className="create-profile-card">

        <form onSubmit={handleSubmit}>

          <div className="create-profile-columns">

            {/* =====================================
                LEFT COLUMN
            ====================================== */}

            <div className="profile-column">

              <h2 className="profile-section-title identity-title">
                IDENTITY
              </h2>

              {/* FULL NAME */}
              <div className="profile-field">

                <label htmlFor="fullName">
                  FULL NAME *
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Sanika Pandhare"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* EMAIL */}
              <div className="profile-field">

                <label htmlFor="email">
                  EMAIL ADDRESS *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="sanika@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="profile-field">

                <label htmlFor="password">
                  PASSWORD *
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PRIMARY ROLE */}
              <div className="profile-field">

                <label htmlFor="primaryRole">
                  PRIMARY ROLE *
                </label>

                <select
                  id="primaryRole"
                  name="primaryRole"
                  value={formData.primaryRole}
                  onChange={handleChange}
                >
                  <option>Full Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>ML Engineer</option>
                  <option>Data Scientist</option>
                  <option>UI / UX Designer</option>
                  <option>DevOps Engineer</option>
                  <option>Cyber Security Engineer</option>
                  <option>Product Manager</option>
                </select>

              </div>

            </div>

            {/* =====================================
                RIGHT COLUMN
            ====================================== */}

            <div className="profile-column">

              <h2 className="profile-section-title stack-title">
                STACK & DOMAINS
              </h2>

              {/* TECH SKILLS */}
              <div className="profile-field">

                <label htmlFor="techSkills">
                  TECH SKILLS *
                </label>

                <input
                  id="techSkills"
                  name="techSkills"
                  type="text"
                  placeholder="React, Node.js, Python, Java, AWS..."
                  value={formData.techSkills}
                  onChange={handleChange}
                  required
                />

                <small
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Comma-separated for smart AI matching
                </small>

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
                  placeholder="AI / ML, HealthTech, FinTech, Web3..."
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
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />

              </div>

              {/* LOCATION */}
              <div className="profile-field">

                <label htmlFor="location">
                  LOCATION
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Pune, India"
                  value={formData.location}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="create-profile-error">
              {error}
            </div>
          )}

          {/* =====================================
              SUCCESS
          ====================================== */}

          {success && (
            <div
              className="create-profile-success"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10b981",
                color: "#34d399",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle2 size={18} />

              Account created successfully!
              Redirecting to login...
            </div>
          )}

          {/* =====================================
              SUBMIT
          ====================================== */}

          <button
            type="submit"
            className="initialize-profile-button"
            disabled={success}
          >
            <UserPlus size={18} />

            INITIALIZE PROFILE & ENTER WORKSPACE
          </button>

          <div className="create-profile-divider"></div>

          {/* =====================================
              LOGIN
          ====================================== */}

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