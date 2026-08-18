import React, { useEffect, useState } from "react";
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
  ClipboardList,
  CalendarDays,
  Settings,
  Search,
  ChevronDown,
  Plus,
  CheckCircle,
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Loader2,
} from "lucide-react";

import {
  getCurrentUserLocal,
  logout,
  getDashboardStats,
  getRecommendedHackathons,
  getUpcomingHackathons,
  getRecentActivity,
} from "../../api/api";

import "./Dashboard.css";

// ── Icon mapping for activity types ──────────────────────
const ACTIVITY_ICONS = {
  REGISTRATION: CheckCircle,
  TEAM:         Users,
  MATCH:        Trophy,
  PROJECT:      Lightbulb,
  MESSAGE:      MessageSquare,
  DEFAULT:      Sparkles,
};

const ACTIVITY_COLORS = {
  REGISTRATION: "success",
  TEAM:         "purple",
  MATCH:        "yellow",
  PROJECT:      "blue",
  MESSAGE:      "green",
  DEFAULT:      "purple",
};

// ── Fallback data (shown while loading or on API error) ──
const FALLBACK_STATS = [
  { icon: Trophy,    value: "—", title: "Hackathons",   subtitle: "Registered: —", type: "purple" },
  { icon: Users,     value: "—", title: "My Teams",     subtitle: "Active Teams",   type: "green"  },
  { icon: Lightbulb, value: "—", title: "Project Ideas", subtitle: "Generated",     type: "yellow" },
  { icon: TrendingUp, value: "—%", title: "Skill Match", subtitle: "Average Score", type: "blue"  },
];

const FALLBACK_HACKATHONS = [
  { title: "AI Innovation Challenge 2026", category: "AI/ML",      date: "18 Aug 2026", prizePool: "₹5,00,000", matchScore: 92, type: "ai"     },
  { title: "Smart City Hackathon",         category: "Smart City", date: "25 Aug 2026", prizePool: "₹3,00,000", matchScore: 86, type: "city"   },
  { title: "FinTech Challenge",            category: "FinTech",    date: "02 Sep 2026", prizePool: "₹4,00,000", matchScore: 81, type: "fintech" },
];

const FALLBACK_UPCOMING = [
  { short: "AI", title: "AI Innovation Challenge", date: "18 Aug 2026", statusType: "registered" },
  { short: "SC", title: "Smart City Hackathon",    date: "25 Aug 2026", statusType: "register"   },
  { short: "FT", title: "FinTech Challenge",       date: "02 Sep 2026", statusType: "register"   },
];

const FALLBACK_ACTIVITIES = [
  { type: "REGISTRATION", message: "You registered for AI Innovation Challenge", time: "2 hours ago" },
  { type: "TEAM",         message: "Priya Singh accepted your team invite",      time: "5 hours ago"  },
  { type: "MATCH",        message: "New teammate match found: 92% compatible",   time: "1 day ago"    },
  { type: "PROJECT",      message: "Project idea generated: AI Study Assistant", time: "1 day ago"    },
  { type: "MESSAGE",      message: "New message in CodeCrafters team",           time: "2 days ago"   },
];

// ─────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();

  // ── User (from localStorage after login) ─────────────
  const currentUser = getCurrentUserLocal() || {};
  const userName   = currentUser.fullName || "Hackathon User";
  const userRole   = currentUser.primaryRole || currentUser.role || "Full Stack";
  const firstLetter = userName.charAt(0).toUpperCase();

  // ── API data state ────────────────────────────────────
  const [stats, setStats]             = useState(null);
  const [hackathons, setHackathons]   = useState(null);
  const [upcoming, setUpcoming]       = useState(null);
  const [activities, setActivities]   = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── Load data on mount ────────────────────────────────
  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      setLoading(true);
      const [statsRes, recRes, upRes, actRes] = await Promise.allSettled([
        getDashboardStats(),
        getRecommendedHackathons(),
        getUpcomingHackathons(),
        getRecentActivity(),
      ]);

      if (!alive) return;

      // Stats
      if (statsRes.status === "fulfilled" && statsRes.value) {
        const s = statsRes.value;
        setStats([
          { icon: Trophy,    value: String(s.hackathons?.value ?? "—"), title: "Hackathons",    subtitle: `Registered: ${s.hackathons?.registered ?? "—"}`, type: "purple" },
          { icon: Users,     value: String(s.teams?.value ?? "—"),      title: "My Teams",      subtitle: "Active Teams",                                    type: "green"  },
          { icon: Lightbulb, value: String(s.projectIdeas?.value ?? "—"), title: "Project Ideas", subtitle: "Generated",                                     type: "yellow" },
          { icon: TrendingUp, value: `${s.skillMatch?.value ?? "—"}%`,  title: "Skill Match",   subtitle: s.skillMatch?.label ?? "Average Score",            type: "blue"   },
        ]);
      } else {
        setStats(FALLBACK_STATS);
      }

      // Recommended hackathons
      if (recRes.status === "fulfilled" && recRes.value?.length > 0) {
        setHackathons(recRes.value.slice(0, 3).map((h) => ({
          id:       h.id,
          title:    h.title,
          category: h.category,
          date:     h.startDate || "—",
          prize:    h.prizePool || "—",
          match:    `${h.matchScore ?? "—"}%`,
          type:     inferType(h.category),
        })));
      } else {
        setHackathons(FALLBACK_HACKATHONS.map((h) => ({ ...h, match: `${h.matchScore}%`, prize: h.prizePool })));
      }

      // Upcoming hackathons
      if (upRes.status === "fulfilled" && upRes.value?.length > 0) {
        setUpcoming(upRes.value.slice(0, 3).map((h) => ({
          id:         h.id,
          short:      (h.title || "??").substring(0, 2).toUpperCase(),
          title:      h.title,
          date:       h.startDate || "—",
          statusType: h.isRegistered ? "registered" : "register",
        })));
      } else {
        setUpcoming(FALLBACK_UPCOMING);
      }

      // Activity
      if (actRes.status === "fulfilled" && actRes.value?.length > 0) {
        setActivities(actRes.value.slice(0, 5).map((a) => ({
          type:    a.type || "DEFAULT",
          message: a.message,
          time:    a.time || "Recently",
        })));
      } else {
        setActivities(FALLBACK_ACTIVITIES);
      }

      setLoading(false);
    }

    fetchAll();
    return () => { alive = false; };
  }, []);

  // ── Navigation ────────────────────────────────────────
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Sidebar menu ──────────────────────────────────────
  const menuItems = [
    { label: "Dashboard",       icon: LayoutDashboard, path: "/dashboard",    active: true },
    { label: "Hackathons",      icon: Trophy,          path: "/hackathons"                },
    { label: "Teams",           icon: Users,           path: "/teams"                     },
    { label: "AI Hub",          icon: Brain,           path: "/ai-hub"                    },
    { label: "Projects",        icon: FolderKanban,    path: "/projects"                  },
    { label: "Chat",            icon: MessageSquare,   path: "/chat"                      },
    { label: "Notifications",   icon: Bell,            path: "/notifications"             },
    { label: "Profile",         icon: User,            path: "/profile"                   },
    { label: "My Registrations",icon: ClipboardList,   path: "/registrations"             },
    { label: "Calendar",        icon: CalendarDays,    path: "/calendar"                  },
    { label: "Settings",        icon: Settings,        path: "/settings"                  },
  ];

  // ── Render ─────────────────────────────────────────────
  const displayStats     = stats     || FALLBACK_STATS;
  const displayHackathons= hackathons|| FALLBACK_HACKATHONS.map((h) => ({ ...h, match: `${h.matchScore}%`, prize: h.prizePool }));
  const displayUpcoming  = upcoming  || FALLBACK_UPCOMING;
  const displayActivities= activities|| FALLBACK_ACTIVITIES;

  return (
    <div className="dashboard-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚀</div>

          <div className="sidebar-logo-text">
            Hackathon<span>Buddy</span>
          </div>
        </div>


        {/* MENU */}

        <nav className="sidebar-menu">

          {menuItems.map(({ label, icon: Icon, path, active }) => (

            <button
              key={label}
              type="button"
              className={`sidebar-menu-item ${active ? "active" : ""}`}
              onClick={() => handleNavigation(path)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>

          ))}

        </nav>

        {/* IMPORTANT: NO PURPLE BOTTOM CARD. SIDEBAR ENDS AFTER SETTINGS. */}

      </aside>


      {/* =====================================================
          MAIN AREA
          ===================================================== */}

      <main className="dashboard-main">


        {/* ===================================================
            TOP HEADER
            =================================================== */}

        <header className="dashboard-header">

          <div className="header-left">

            <button className="mobile-menu-button" type="button">
              ☰
            </button>

            <h1>Dashboard</h1>

          </div>


          {/* SEARCH */}

          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Search hackathons, teams, skills..."
            />
            <Search size={21} />
          </div>


          {/* HEADER RIGHT */}

          <div className="header-right">

            <button className="header-icon-button" type="button">
              <Bell size={22} />
              <span className="notification-count">5</span>
            </button>


            <button className="header-icon-button" type="button">
              <MessageSquare size={22} />
              <span className="notification-count">3</span>
            </button>


            <div
              className="header-profile"
              role="button"
              tabIndex={0}
              onClick={handleLogout}
              title="Click to log out"
              style={{ cursor: "pointer" }}
            >
              <div className="header-avatar">{firstLetter}</div>

              <div className="header-user-info">
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </div>

              <ChevronDown size={18} />
            </div>

          </div>

        </header>


        {/* ===================================================
            DASHBOARD CONTENT
            =================================================== */}

        <div className="dashboard-content">


          {/* WELCOME */}

          <section className="welcome-section">

            <div className="welcome-content">

              <h2>
                Good Evening, {userName}! 👋
              </h2>

              <p>
                Discover hackathons, build your dream team,
                <br />
                and create innovative solutions.
              </p>


              <div className="welcome-buttons">

                <button
                  type="button"
                  className="primary-action"
                  onClick={() => handleNavigation("/hackathons")}
                >
                  <Search size={18} />
                  Find Hackathons
                </button>


                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => handleNavigation("/matching")}
                >
                  <UserPlus size={18} />
                  Find Teammates
                </button>

              </div>

            </div>


            <div className="welcome-illustration">
              <div className="illustration-person">👨‍💻</div>
              <div className="illustration-person second">👩‍💻</div>
              <div className="illustration-person third">👨‍💻</div>
            </div>

          </section>


          {/* =================================================
              STATISTICS
              ================================================= */}

          <section className="stats-grid">

            {loading ? (
              <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: "0.75rem", color: "#9ca3af" }}>
                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                Loading stats…
              </div>
            ) : (
              displayStats.map(({ icon: Icon, value, title, subtitle, type }) => (

                <div className={`stat-card ${type}`} key={title}>

                  <div className="stat-icon">
                    <Icon size={24} />
                  </div>

                  <strong className="stat-value">{value}</strong>

                  <span className="stat-title">{title}</span>

                  <span className="stat-subtitle">{subtitle}</span>

                  <div className="stat-chart">╱╲╱╲╱╲</div>

                </div>

              ))
            )}

          </section>


          {/* =================================================
              RECOMMENDED + AI HUB
              ================================================= */}

          <section className="middle-grid">


            {/* RECOMMENDED HACKATHONS */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <h2>Recommended Hackathons</h2>

                <button
                  type="button"
                  onClick={() => handleNavigation("/hackathons")}
                >
                  View All
                </button>

              </div>


              <div className="hackathon-cards">

                {displayHackathons.map((hackathon) => (

                  <div className="hackathon-card" key={hackathon.title}>

                    <div className={`hackathon-image ${hackathon.type}`}>
                      {hackathon.type === "ai"     && "AI"}
                      {hackathon.type === "city"   && "CITY"}
                      {hackathon.type === "fintech"&& "FINTECH"}
                      {!["ai","city","fintech"].includes(hackathon.type) && hackathon.category?.substring(0,3).toUpperCase()}
                    </div>


                    <h3>{hackathon.title}</h3>


                    <span className="category-tag">{hackathon.category}</span>


                    <p>📅 {hackathon.date}</p>

                    <p>Prize Pool: {hackathon.prize}</p>


                    <div className="hackathon-footer">

                      <strong>{hackathon.match} Match</strong>

                      <button
                        type="button"
                        onClick={() => handleNavigation("/hackathons")}
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* AI HUB */}

            <div className="dashboard-panel">

              <div className="panel-header">
                <h2>AI Hub</h2>
              </div>


              <div className="ai-hub-grid">


                <div className="ai-card purple">

                  <div className="ai-card-icon">👥</div>

                  <h3>AI Teammate<br />Matching</h3>

                  <p>
                    Find the perfect teammates
                    based on skills and interests.
                  </p>

                  <button
                    type="button"
                    onClick={() => handleNavigation("/matching")}
                  >
                    Find Teammates
                  </button>

                </div>


                <div className="ai-card green">

                  <div className="ai-card-icon">📊</div>

                  <h3>Skill Gap<br />Analysis</h3>

                  <p>
                    Analyze your team skills
                    and discover missing skills.
                  </p>

                  <button type="button">
                    Analyze Team
                  </button>

                </div>


                <div className="ai-card yellow">

                  <div className="ai-card-icon">💡</div>

                  <h3>Project Idea<br />Generator</h3>

                  <p>
                    Get AI-powered project ideas
                    for your next hackathon.
                  </p>

                  <button type="button">
                    Generate Ideas
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              BOTTOM GRID
              ================================================= */}

          <section className="bottom-grid">


            {/* MY TEAM */}

            <div className="dashboard-panel team-panel">

              <div className="panel-header">
                <h2>My Team - CodeCrafters</h2>
                <button type="button">View Team</button>
              </div>


              <div className="team-members">

                {/* Current user always first */}
                <div className="team-member">
                  <div className="team-avatar">{firstLetter}</div>
                  <strong>{userName}</strong>
                  <span>{userRole}</span>
                  <small>You</small>
                </div>

                {[
                  { letter: "P", name: "Priya Singh",  role: "UI/UX Designer"   },
                  { letter: "R", name: "Rohan Mehta",  role: "ML Developer"     },
                  { letter: "A", name: "Aman Khan",    role: "DevOps Engineer"  },
                ].map((member) => (
                  <div className="team-member" key={member.name}>
                    <div className="team-avatar">{member.letter}</div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                ))}


                <button type="button" className="add-member">
                  <Plus size={27} />
                  <span>Add Member</span>
                </button>

              </div>


              <div className="team-divider" />


              <div className="skill-coverage">

                <div className="coverage-header">
                  <strong>Team Skill Coverage</strong>
                  <strong>82%</strong>
                </div>

                <div className="progress-bar">
                  <div className="progress-value" style={{ width: "82%" }} />
                </div>

              </div>


              <div className="missing-skills">

                <strong>Missing Skills</strong>

                <div className="skill-tags">
                  <span>Docker</span>
                  <span>AWS</span>
                  <span>Kubernetes</span>
                </div>


                <button type="button" className="skill-gap-button">
                  Skill Gap Analysis
                </button>

              </div>

            </div>


            {/* UPCOMING */}

            <div className="dashboard-panel">

              <div className="panel-header">
                <h2>Upcoming Hackathons</h2>
                <button type="button">View Calendar</button>
              </div>


              <div className="upcoming-list">

                {displayUpcoming.map((item) => (

                  <div className="upcoming-item" key={item.title}>

                    <div className="upcoming-icon">{item.short}</div>


                    <div className="upcoming-info">
                      <strong>{item.title}</strong>
                      <span>📅 {item.date}</span>
                    </div>


                    {item.statusType === "registered" ? (
                      <span className="registered-status">✓ Registered</span>
                    ) : (
                      <button
                        type="button"
                        className="register-button"
                        onClick={() => handleNavigation("/hackathons")}
                      >
                        Register
                      </button>
                    )}

                  </div>

                ))}

              </div>


              <button
                type="button"
                className="see-all-button"
                onClick={() => handleNavigation("/hackathons")}
              >
                See All Hackathons
                <ArrowRight size={18} />
              </button>

            </div>


            {/* RECENT ACTIVITY */}

            <div className="dashboard-panel">

              <div className="panel-header">
                <h2>Recent Activity</h2>
                <button type="button">View All</button>
              </div>


              <div className="activity-list">

                {displayActivities.map((activity, idx) => {
                  const Icon  = ACTIVITY_ICONS[activity.type]  || ACTIVITY_ICONS.DEFAULT;
                  const color = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.DEFAULT;
                  return (
                    <div className="activity-item" key={idx}>

                      <div className={`activity-icon ${color}`}>
                        <Icon size={18} />
                      </div>


                      <div className="activity-content">
                        <strong>{activity.message}</strong>
                        <span>{activity.time}</span>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

// Helper — infer visual type from category string
function inferType(category) {
  if (!category) return "ai";
  const c = category.toLowerCase();
  if (c.includes("ai") || c.includes("ml"))      return "ai";
  if (c.includes("city") || c.includes("smart")) return "city";
  if (c.includes("fin"))                          return "fintech";
  return "ai";
}

export default Dashboard;