import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  Brain,
  FolderKanban,
  MessageSquare,
  Bell,
  User,
  Search,
  Plus,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  UserPlus,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    hackathons,
    registeredHackathons,
    toggleHackathonRegistration,
    teamMembers,
    projects,
    notifications
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");

  const userName = currentUser?.fullName || "Developer";
  const userRole = currentUser?.primaryRole || currentUser?.role || "Full Stack Developer";
  const firstLetter = userName.charAt(0).toUpperCase();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: true },
    { label: "Admin Console", icon: ShieldCheck, path: "/admin" },
    { label: "Hackathons", icon: Trophy, path: "/hackathons" },
    { label: "Teams", icon: Users, path: "/teams" },
    { label: "AI Hub", icon: Brain, path: "/ai-hub" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const stats = [
    {
      icon: Trophy,
      value: hackathons.length.toString(),
      title: "Hackathons",
      subtitle: `Registered: ${registeredHackathons.length}`,
      type: "purple",
    },
    {
      icon: Users,
      value: teamMembers.length.toString(),
      title: "Team Members",
      subtitle: "Active Squad",
      type: "green",
    },
    {
      icon: FolderKanban,
      value: projects.length.toString(),
      title: "Projects",
      subtitle: "In Workspace",
      type: "yellow",
    },
    {
      icon: TrendingUp,
      value: "92%",
      title: "Skill Match",
      subtitle: "Squad Compatibility",
      type: "blue",
    },
  ];

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚀</div>
          <div className="sidebar-logo-text">
            Hackathon<span>Buddy</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(({ label, icon: Icon, path, active }) => (
            <button
              key={label}
              type="button"
              className={`sidebar-menu-item ${active ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom-badge" style={{
          margin: "auto 12px 16px",
          padding: "14px",
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(34, 211, 238, 0.1))",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <Sparkles size={20} color="#a78bfa" style={{ marginBottom: "6px" }} />
          <h4 style={{ color: "#f8fafc", fontSize: "13px", margin: "0 0 4px" }}>AI Engine v2.4</h4>
          <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 10px" }}>Active real-time teammate matching</p>
          <button
            onClick={() => navigate("/ai-hub")}
            style={{
              width: "100%",
              padding: "7px 10px",
              background: "#7c3aed",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontSize: "11.5px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Launch AI Hub
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* SUBHEADER & SEARCH */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "2px 0 0" }}>
              Welcome back, {userName} • {userRole}
            </p>
          </div>

          <div className="dashboard-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search hackathons, teams, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="dashboard-content">
          {/* WELCOME HERO */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2>
                Good Day, {currentUser?.firstName || userName.split(" ")[0]}! 👋
              </h2>
              <p>
                Discover top hackathons, build balanced teams with AI matching,
                and ship winning solutions together.
              </p>

              <div className="welcome-buttons">
                <button
                  type="button"
                  className="primary-action"
                  onClick={() => navigate("/hackathons")}
                >
                  <Trophy size={18} />
                  Explore Hackathons
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => navigate("/teams")}
                >
                  <UserPlus size={18} />
                  Find Teammates
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => navigate("/ai-hub")}
                  style={{ background: "rgba(34, 211, 238, 0.12)", borderColor: "rgba(34, 211, 238, 0.35)", color: "#38bdf8" }}
                >
                  <Brain size={18} />
                  AI Hub Tools
                </button>
              </div>
            </div>

            <div className="welcome-illustration">
              <div className="illustration-person">👨‍💻</div>
              <div className="illustration-person second">👩‍💻</div>
              <div className="illustration-person third">🚀</div>
            </div>
          </section>

          {/* STATISTICS GRID */}
          <section className="stats-grid">
            {stats.map(({ icon: Icon, value, title, subtitle, type }) => (
              <div className={`stat-card ${type}`} key={title}>
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <strong className="stat-value">{value}</strong>
                <span className="stat-title">{title}</span>
                <span className="stat-subtitle">{subtitle}</span>
                <div className="stat-chart">╱╲╱╲╱╲</div>
              </div>
            ))}
          </section>

          {/* MIDDLE GRID: RECOMMENDED + AI HUB */}
          <section className="middle-grid">
            {/* RECOMMENDED HACKATHONS */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Recommended Hackathons</h2>
                <button
                  type="button"
                  onClick={() => navigate("/hackathons")}
                >
                  View All ({hackathons.length})
                </button>
              </div>

              <div className="hackathon-cards">
                {filteredHackathons.slice(0, 3).map((hackathon) => {
                  const isRegistered = registeredHackathons.includes(hackathon.id);
                  return (
                    <div className="hackathon-card" key={hackathon.id}>
                      <div className={`hackathon-image ${hackathon.type || "ai"}`}>
                        {hackathon.icon || "🏆"}
                      </div>

                      <h3>{hackathon.title}</h3>
                      <span className="category-tag">{hackathon.category}</span>

                      <p>📅 {hackathon.date} • {hackathon.location}</p>
                      <p>Prize Pool: <strong>{hackathon.prize}</strong></p>

                      <div className="hackathon-footer">
                        <strong>{hackathon.match}% Match</strong>
                        <button
                          type="button"
                          className={isRegistered ? "registered-btn" : ""}
                          style={isRegistered ? { background: "#10b981", color: "white", borderColor: "#10b981" } : {}}
                          onClick={() => toggleHackathonRegistration(hackathon.id)}
                        >
                          {isRegistered ? "✓ Registered" : "Register Now"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI HUB SHORTCUTS */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>AI Innovation Hub</h2>
                <button type="button" onClick={() => navigate("/ai-hub")}>
                  Open Hub →
                </button>
              </div>

              <div className="ai-hub-grid">
                <div className="ai-card purple" onClick={() => navigate("/ai-hub")}>
                  <div className="ai-card-icon">👥</div>
                  <h3>AI Teammate<br />Matching</h3>
                  <p>Find the perfect teammates based on skills and domain synergy.</p>
                  <button type="button">Find Teammates</button>
                </div>

                <div className="ai-card green" onClick={() => navigate("/ai-hub")}>
                  <div className="ai-card-icon">📊</div>
                  <h3>Skill Gap<br />Analysis</h3>
                  <p>Analyze team strengths and uncover missing critical skills.</p>
                  <button type="button">Analyze Team</button>
                </div>

                <div className="ai-card yellow" onClick={() => navigate("/ai-hub")}>
                  <div className="ai-card-icon">💡</div>
                  <h3>Project Idea<br />Generator</h3>
                  <p>Generate winning AI project prompts tailored to your stack.</p>
                  <button type="button">Generate Ideas</button>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM GRID: MY TEAM + RECENT ACTIVITY */}
          <section className="bottom-grid">
            {/* MY TEAM */}
            <div className="dashboard-panel team-panel">
              <div className="panel-header">
                <h2>My Team ({teamMembers.length} Members)</h2>
                <button type="button" onClick={() => navigate("/teams")}>
                  Manage Team
                </button>
              </div>

              <div className="team-members">
                {teamMembers.map((member) => (
                  <div className="team-member" key={member.id}>
                    <div className="team-avatar">{member.letter || member.name.charAt(0)}</div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                    {member.isYou && <small>You</small>}
                  </div>
                ))}

                <button
                  type="button"
                  className="add-member"
                  onClick={() => navigate("/teams")}
                >
                  <Plus size={24} />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="team-divider" />

              <div className="skill-coverage">
                <div className="coverage-header">
                  <strong>Squad Skill Coverage</strong>
                  <strong style={{ color: "#10b981" }}>88%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="missing-skills">
                <strong>Recommended Additions</strong>
                <div className="skill-tags">
                  <span>Docker</span>
                  <span>AWS</span>
                  <span>Kubernetes</span>
                </div>
                <button
                  type="button"
                  className="skill-gap-button"
                  onClick={() => navigate("/ai-hub")}
                >
                  Run Full Skill Gap Analysis
                </button>
              </div>
            </div>

            {/* RECENT NOTIFICATIONS & ACTIVITY */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2>Recent Activity</h2>
                <button type="button" onClick={() => navigate("/notifications")}>
                  View All ({notifications.length})
                </button>
              </div>

              <div className="activity-list">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    className="activity-item"
                    key={notif.id}
                    onClick={() => navigate(notif.route || "/notifications")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={`activity-icon ${notif.type}`}>
                      {notif.icon || <Bell size={18} />}
                    </div>
                    <div className="activity-content">
                      <strong>{notif.title}</strong>
                      <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px" }}>
                        {notif.message}
                      </p>
                      <span>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;