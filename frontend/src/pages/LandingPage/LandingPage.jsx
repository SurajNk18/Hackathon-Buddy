import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Users,
  Trophy,
  Brain,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Code2,
  MessageSquare,
  FolderKanban,
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  UserPlus
} from "lucide-react";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Interactive Matcher widget state on Landing Page
  const [demoDomain, setDemoDomain] = useState("AI / ML");
  const [demoRole, setDemoRole] = useState("Full Stack Developer");
  const [expandedFaq, setExpandedFaq] = useState(0);

  const demoTeammates = [
    {
      name: "Priya Sharma",
      role: "UI/UX Designer",
      skills: ["Figma", "Prototyping", "Design Systems"],
      match: 96,
      avatar: "P",
      domain: "AI / ML"
    },
    {
      name: "Rohan Mehta",
      role: "ML Engineer",
      skills: ["Python", "TensorFlow", "NLP", "PyTorch"],
      match: 94,
      avatar: "R",
      domain: "AI / ML"
    },
    {
      name: "Aman Khan",
      role: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      match: 91,
      avatar: "A",
      domain: "FinTech"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Teammate Matching Engine work?",
      a: "Our algorithm analyzes your technical stack, problem domain preferences, and role compatibility to recommend hackers whose skills fill your team's specific skill gaps, maximizing your winning chances."
    },
    {
      q: "Can I use HackathonBuddy without an existing team?",
      a: "Absolutely! You can join solo, browse active squads looking for your exact skills, or create your own project and invite complementary hackers with one click."
    },
    {
      q: "Does this require any local storage or server dependencies to test?",
      a: "No! HackathonBuddy runs on a clean, centralized reactive in-memory architecture. You can test all features, project boards, and chat instantly in the browser."
    },
    {
      q: "What tools are included in the workspace?",
      a: "You get interactive sprint task boards (Kanban), AI skill gap auditors, project idea generators, team chat, and a curated directory of active hackathons with prize pools."
    }
  ];

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="brand-icon">🚀</div>
          <div className="brand-name">
            HACKATHON<span>BUDDY</span>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#interactive-demo">AI Matcher</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#faqs">FAQs</a>
        </div>

        <div className="landing-nav-actions">
          <button className="login-link" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button
            className="get-started-btn"
            onClick={() => navigate("/create-profile")}
          >
            GET STARTED FREE
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-bg hero-glow-left" />
        <div className="hero-glow-bg hero-glow-right" />

        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI-POWERED SQUAD MATCHING & WORKSPACE</span>
          </div>

          <h1 className="hero-title">
            FIND YOUR <span className="gradient-text">IDEAL SQUAD</span>
            <br />& SHIP WINNING PROJECTS
          </h1>

          <p className="hero-description">
            The all-in-one developer workspace designed for hackathon champions.
            Match with compatible teammates, audit squad skill gaps, coordinate sprint tasks,
            and brainstorm prize-worthy ideas with generative AI.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-hero-btn"
              onClick={() => navigate("/create-profile")}
            >
              <span>CREATE DEVELOPER PROFILE</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-hero-btn"
              onClick={() => navigate("/dashboard")}
            >
              <Zap size={18} />
              <span>Explore Live Dashboard</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <strong>96%</strong>
              <span>Skill Synergy Match</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <strong>12+</strong>
              <span>Active Hackathons</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <strong>₹25L+</strong>
              <span>Prize Pools Listed</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <strong>100%</strong>
              <span>Instant Reactive UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO WIDGET SECTION */}
      <section id="interactive-demo" className="interactive-demo-section">
        <div className="demo-card-container">
          <div className="demo-header">
            <div className="demo-title-group">
              <span className="demo-kicker">LIVE INTERACTIVE DEMO</span>
              <h2>Test the AI Teammate Matching Engine</h2>
              <p>Select your track and desired role to preview instant calculated candidate recommendations.</p>
            </div>

            <div className="demo-controls">
              <select value={demoDomain} onChange={(e) => setDemoDomain(e.target.value)}>
                <option>AI / ML</option>
                <option>FinTech</option>
                <option>HealthTech</option>
                <option>Web3</option>
              </select>

              <select value={demoRole} onChange={(e) => setDemoRole(e.target.value)}>
                <option>Full Stack Developer</option>
                <option>ML Engineer</option>
                <option>UI/UX Designer</option>
              </select>
            </div>
          </div>

          {/* Candidate Preview Cards */}
          <div className="demo-candidates-grid">
            {demoTeammates.map((cand, idx) => (
              <div className="demo-candidate-card" key={idx}>
                <div className="demo-cand-top">
                  <div className="demo-avatar">{cand.avatar}</div>
                  <div>
                    <strong>{cand.name}</strong>
                    <span>{cand.role}</span>
                  </div>
                  <div className="demo-match-badge">{cand.match}% MATCH</div>
                </div>

                <div className="demo-skills-list">
                  {cand.skills.map((sk) => (
                    <span key={sk}>✓ {sk}</span>
                  ))}
                </div>

                <button
                  className="demo-connect-btn"
                  onClick={() => navigate("/create-profile")}
                >
                  <UserPlus size={15} />
                  <span>Connect in Workspace</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES PILLARS SECTION */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-heading">
            <p>DESIGNED FOR HIGH-VELOCITY SPRINTS</p>
            <h2>EVERYTHING YOU NEED TO BUILD, SPRINT & WIN</h2>
            <span>
              Say goodbye to fragmented Discord channels and spreadsheet task lists.
              Manage your entire hackathon lifecycle under one unified roof.
            </span>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon purple">🧠</div>
              <div className="feature-number">01</div>
              <h3>AI Teammate Matcher</h3>
              <p>
                Match with complementary hackers based on verified technical stacks, role requirements, and project tracks.
              </p>
              <button onClick={() => navigate("/teams")}>
                EXPLORE SQUAD BUILDER →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">📊</div>
              <div className="feature-number">02</div>
              <h3>Skill Gap Analyzer</h3>
              <p>
                Audit your team capabilities in real-time to identify missing skills like DevOps, Backend, or UI/UX before sprint kickoff.
              </p>
              <button onClick={() => navigate("/ai-hub")}>
                RUN GAP AUDIT →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon yellow">💡</div>
              <div className="feature-number">03</div>
              <h3>AI Idea Generator</h3>
              <p>
                Generate prize-winning hackathon blueprints customized to your preferred technologies and industry problem tracks.
              </p>
              <button onClick={() => navigate("/ai-hub")}>
                GENERATE BLUEPRINTS →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">📁</div>
              <div className="feature-number">04</div>
              <h3>Sprint Task Board</h3>
              <p>
                Manage deliverables, assign priorities, and track progress bars with our built-in lightweight Kanban board.
              </p>
              <button onClick={() => navigate("/projects")}>
                OPEN TASK BOARD →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink">💬</div>
              <div className="feature-number">05</div>
              <h3>Encrypted Team Chat</h3>
              <p>
                Collaborate in dedicated project channels, coordinate code reviews, and share instant feedback with your squad.
              </p>
              <button onClick={() => navigate("/chat")}>
                JOIN CHAT ROOMS →
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">🏆</div>
              <div className="feature-number">06</div>
              <h3>Curated Hackathons</h3>
              <p>
                Discover active hackathons with prize pools, duration countdowns, online/offline filters, and one-click registration.
              </p>
              <button onClick={() => navigate("/hackathons")}>
                BROWSE HACKATHONS →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="how-container">
          <div className="how-header">
            <span className="how-kicker">SIMPLE & FAST ONBOARDING</span>
            <h2>HOW HACKATHONBUDDY WORKS</h2>
            <p>From zero to a fully coordinated hackathon team in 3 simple steps.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-badge">STEP 1</div>
              <h3>Create Your Persona</h3>
              <p>Enter your tech stack, role, and domain interests. No complex setup or passwords required.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-badge">STEP 2</div>
              <h3>Match & Form Squad</h3>
              <p>Use AI matching to discover complementary hackers and invite them into your private workspace.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-badge">STEP 3</div>
              <h3>Build & Win</h3>
              <p>Brainstorm ideas, manage sprint tasks, chat in real-time, and ship your hackathon MVP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <span className="how-kicker">HACKER COMMUNITY</span>
            <h2>LOVED BY BUILDERS ACROSS 20+ HACKATHONS</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p>
                "We found our ML engineer 4 hours before hackathon kickoff using HackathonBuddy. Ended up taking 1st place in the AI track!"
              </p>
              <div className="testi-author">
                <div className="author-avatar">R</div>
                <div>
                  <strong>Rahul Deshmukh</strong>
                  <span>Winner, Smart City Hackathon 2026</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p>
                "The skill gap analysis showed us we were missing a DevOps engineer for AWS deployment. We recruited Aman and deployed seamlessly."
              </p>
              <div className="testi-author">
                <div className="author-avatar">S</div>
                <div>
                  <strong>Sneha Kulkarni</strong>
                  <span>Full Stack Developer</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p>
                "The task board and AI idea generator gave us a clear roadmap from hour 1. It is literally the ultimate hackathon cheat code."
              </p>
              <div className="testi-author">
                <div className="author-avatar">A</div>
                <div>
                  <strong>Arjun Nair</strong>
                  <span>FinTech Hackathon Participant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faqs" className="faqs-section">
        <div className="faqs-container">
          <div className="faqs-header">
            <span className="how-kicker">FREQUENTLY ASKED QUESTIONS</span>
            <h2>EVERYTHING YOU NEED TO KNOW</h2>
          </div>

          <div className="faqs-list">
            {faqs.map((faq, idx) => (
              <div
                className={`faq-item ${expandedFaq === idx ? "expanded" : ""}`}
                key={idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
              >
                <div className="faq-question">
                  <strong>{faq.q}</strong>
                  {expandedFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="final-cta-section">
        <div className="final-cta-card">
          <div className="cta-glow-bg" />
          <h2>READY TO ASSEMBLE YOUR WINNING HACKATHON TEAM?</h2>
          <p>
            Join thousands of developers, designers, and creators building the future together.
          </p>
          <div className="cta-buttons">
            <button
              className="primary-hero-btn"
              onClick={() => navigate("/create-profile")}
            >
              <span>GET STARTED NOW — FREE</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="secondary-hero-btn"
              onClick={() => navigate("/dashboard")}
            >
              <span>Launch Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="landing-brand">
            <div className="brand-icon small">🚀</div>
            <div className="brand-name">
              HACKATHON<span>BUDDY</span>
            </div>
          </div>
          <p>© 2026 HackathonBuddy. Engineered with precision for hackathon builders.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;