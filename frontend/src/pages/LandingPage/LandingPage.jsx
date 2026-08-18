import React from "react";
import { useNavigate } from "react-router-dom";

import "./LandingPage.css";

function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <nav className="landing-navbar">

        <div className="landing-brand">

          <div className="brand-icon">
            🚀
          </div>

          <div className="brand-name">
            HACKATHON<span>BUDDY</span>
          </div>

        </div>


        <div className="landing-nav-actions">

          <button
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>


          <button
            className="get-started-btn"
            onClick={() => navigate("/create-profile")}
          >
            GET STARTED
          </button>

        </div>

      </nav>


      <section className="hero-section">

        <div className="hero-badge">
          CONNECT • BUILD • SHIP
        </div>


        <h1 className="hero-title">

          FIND YOUR

          <span>
            IDEAL TEAM
          </span>

          IN SECONDS

        </h1>


        <p className="hero-description">
          The ultimate platform for hackers. Match with compatible
          teammates based on skills, interests, and role compatibility.
          Collaborative coding & GitHub integration included.
        </p>


        <div className="hero-buttons">

          <button
            className="primary-hero-btn"
            onClick={() => navigate("/create-profile")}
          >
            CREATE YOUR PROFILE
          </button>


          <button className="secondary-hero-btn">
            Explore Projects
          </button>

        </div>

      </section>


      <section className="features-section">

        <div className="features-container">

          <div className="features-heading">

            <p>BUILT FOR HACKERS</p>

            <h2>
              EVERYTHING YOU NEED TO BUILD TOGETHER
            </h2>

            <span>
              From finding the right teammate to building your
              project together, HackathonBuddy keeps everything
              in one place.
            </span>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                🧠
              </div>

              <div className="feature-number">
                01
              </div>

              <h3>
                AI Smart Matching
              </h3>

              <p>
                Find teammates based on skills, interests,
                roles and project requirements using our
                intelligent matching system.
              </p>

              <button>
                FIND YOUR MATCH →
              </button>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                🤝
              </div>

              <div className="feature-number">
                02
              </div>

              <h3>
                Build Your Team
              </h3>

              <p>
                Create projects, invite teammates and build
                a team with the right combination of skills
                for your hackathon idea.
              </p>

              <button>
                BUILD TOGETHER →
              </button>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                🚀
              </div>

              <div className="feature-number">
                03
              </div>

              <h3>
                Discover Hackathons
              </h3>

              <p>
                Discover upcoming hackathons and find
                opportunities that match your interests,
                skills and project goals.
              </p>

              <button>
                EXPLORE EVENTS →
              </button>

            </div>

          </div>


          <div className="landing-stats">

            <div className="stat-item">
              <strong>AI</strong>
              <span>POWERED MATCHING</span>
            </div>

            <div className="stat-item">
              <strong>3+</strong>
              <span>WAYS TO COLLABORATE</span>
            </div>

            <div className="stat-item">
              <strong>1</strong>
              <span>PLACE TO BUILD</span>
            </div>

          </div>

        </div>

      </section>


      <footer className="landing-footer">
        © 2026 HackathonBuddy. Made for Hackers.
      </footer>

    </div>
  );
}

export default LandingPage;