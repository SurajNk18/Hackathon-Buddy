import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Trophy,
  Users,
  Brain,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  SlidersHorizontal,
  X,
  ExternalLink,
  Sparkles,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  Zap,
  Activity,
  UserCheck,
  UserX
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    hackathons,
    addHackathon,
    deleteHackathon,
    updateHackathonStatus,
    adminUsers,
    toggleUserStatus,
    deleteAdminUser,
    teamMembers,
    projects
  } = useApp();

  const [activeTab, setActiveTab] = useState("hackathons");
  const [hackathonSearch, setHackathonSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Hackathon Form State
  const [newHackathon, setNewHackathon] = useState({
    title: "",
    category: "AI/ML",
    description: "",
    prize: "₹3,00,000",
    date: "10 Oct 2026",
    deadline: "05 Oct 2026",
    location: "Online",
    duration: "48 Hours",
    participants: 500,
    status: "Open",
    level: "All Levels"
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newHackathon.title.trim()) return;

    addHackathon(newHackathon);
    setNewHackathon({
      title: "",
      category: "AI/ML",
      description: "",
      prize: "₹3,00,000",
      date: "10 Oct 2026",
      deadline: "05 Oct 2026",
      location: "Online",
      duration: "48 Hours",
      participants: 500,
      status: "Open",
      level: "All Levels"
    });
    setShowCreateModal(false);
  };

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
      h.category.toLowerCase().includes(hackathonSearch.toLowerCase())
  );

  const filteredUsers = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* ADMIN TOP BAR */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-badge-icon">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1>Admin Control Console</h1>
            <span className="admin-subtext">HackathonBuddy Global Management System</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <button
            className="back-hacker-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={16} />
            <span>Return to Hacker Dashboard</span>
          </button>

          <button
            className="create-hackathon-top-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            <span>Create Hackathon</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <section className="admin-kpi-grid">
        <div className="admin-kpi-card purple">
          <div className="kpi-icon-box">
            <Trophy size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Hackathons</span>
            <strong className="kpi-value">{hackathons.length}</strong>
            <small className="kpi-delta positive">✓ Live in directory</small>
          </div>
        </div>

        <div className="admin-kpi-card blue">
          <div className="kpi-icon-box">
            <Users size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Registered Hackers</span>
            <strong className="kpi-value">{adminUsers.length}</strong>
            <small className="kpi-delta positive">98% verified personas</small>
          </div>
        </div>

        <div className="admin-kpi-card green">
          <div className="kpi-icon-box">
            <FolderKanban size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Workspaces</span>
            <strong className="kpi-value">{projects.length}</strong>
            <small className="kpi-delta positive">Sprint tasks tracking</small>
          </div>
        </div>

        <div className="admin-kpi-card yellow">
          <div className="kpi-icon-box">
            <Activity size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">AI Engine Synergy</span>
            <strong className="kpi-value">96.8%</strong>
            <small className="kpi-delta positive">v2.4 active engine</small>
          </div>
        </div>
      </section>

      {/* ADMIN TABS */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === "hackathons" ? "active" : ""}`}
          onClick={() => setActiveTab("hackathons")}
        >
          <Trophy size={18} />
          <span>Hackathon Directory ({hackathons.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} />
          <span>Hacker Directory ({adminUsers.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={18} />
          <span>AI Engine Telemetry</span>
        </button>
      </div>

      {/* TAB 1: HACKATHON MANAGEMENT */}
      {activeTab === "hackathons" && (
        <section className="admin-content-section">
          <div className="admin-table-toolbar">
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search hackathons by title, category..."
                value={hackathonSearch}
                onChange={(e) => setHackathonSearch(e.target.value)}
              />
            </div>

            <button
              className="admin-primary-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} /> Add New Hackathon Challenge
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>HACKATHON CHALLENGE</th>
                  <th>TRACK</th>
                  <th>PRIZE POOL</th>
                  <th>DATES & DEADLINE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredHackathons.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="table-icon">{h.icon || "🏆"}</span>
                        <div>
                          <strong>{h.title}</strong>
                          <small>{h.description?.substring(0, 55)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="track-badge">{h.category}</span>
                    </td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>{h.prize}</strong>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span>Event: {h.date}</span>
                        <small>Deadline: {h.deadline}</small>
                      </div>
                    </td>
                    <td>{h.location}</td>
                    <td>
                      <select
                        className={`status-select ${h.status.toLowerCase()}`}
                        value={h.status}
                        onChange={(e) => updateHackathonStatus(h.id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="table-delete-btn"
                        onClick={() => {
                          if (window.confirm(`Delete "${h.title}" from hackathon directory?`)) {
                            deleteHackathon(h.id);
                          }
                        }}
                        title="Delete Hackathon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <section className="admin-content-section">
          <div className="admin-table-toolbar">
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search registered hackers by name, email, role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>DEVELOPER PERSONA</th>
                  <th>ROLE</th>
                  <th>TECH STACK</th>
                  <th>JOINED</th>
                  <th>STATUS</th>
                  <th>MODERATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="table-title-cell">
                        <div className="user-table-avatar">{u.name.charAt(0)}</div>
                        <div>
                          <strong>{u.name}</strong>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="track-badge">{u.role}</span>
                    </td>
                    <td>
                      <div className="skills-cell-preview">{u.skills}</div>
                    </td>
                    <td>{u.joinedDate}</td>
                    <td>
                      <span className={`user-status-pill ${u.status.toLowerCase()}`}>
                        {u.status === "Active" ? "✓ Active" : "⊘ Suspended"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className={`user-action-btn ${u.status === "Active" ? "suspend" : "activate"}`}
                          onClick={() => toggleUserStatus(u.id)}
                        >
                          {u.status === "Active" ? (
                            <>
                              <UserX size={14} /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} /> Activate
                            </>
                          )}
                        </button>
                        <button
                          className="table-delete-btn"
                          onClick={() => {
                            if (window.confirm(`Delete user ${u.name}?`)) {
                              deleteAdminUser(u.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: AI ENGINE TELEMETRY */}
      {activeTab === "analytics" && (
        <section className="admin-content-section">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>⚡ Top In-Demand Hackathon Skills</h3>
              <p>Aggregated across active squad matching requests</p>
              <div className="skill-metric-bars">
                {[
                  { skill: "React / Next.js", pct: 92, count: "480 squads" },
                  { skill: "Python & Machine Learning", pct: 88, count: "420 squads" },
                  { skill: "Docker & AWS DevOps", pct: 76, count: "310 squads" },
                  { skill: "Spring Boot & Java", pct: 65, count: "240 squads" },
                  { skill: "PostgreSQL & Databases", pct: 60, count: "210 squads" }
                ].map((item) => (
                  <div className="metric-row" key={item.skill}>
                    <div className="metric-header">
                      <span>{item.skill}</span>
                      <small>{item.count} ({item.pct}%)</small>
                    </div>
                    <div className="metric-bar">
                      <div style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <h3>🏆 Domain Track Popularity</h3>
              <p>Hackathon distribution across industry verticals</p>
              <div className="skill-metric-bars">
                {[
                  { domain: "AI / ML & Generative AI", pct: 85, color: "#8b5cf6" },
                  { domain: "Smart City & IoT", pct: 68, color: "#06b6d4" },
                  { domain: "FinTech & Web3", pct: 54, color: "#f59e0b" },
                  { domain: "HealthTech & MedTech", pct: 45, color: "#ec4899" },
                  { domain: "GreenTech & Sustainability", pct: 35, color: "#10b981" }
                ].map((item) => (
                  <div className="metric-row" key={item.domain}>
                    <div className="metric-header">
                      <span>{item.domain}</span>
                      <small>{item.pct}% of submissions</small>
                    </div>
                    <div className="metric-bar">
                      <div style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CREATE HACKATHON MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Trophy size={22} color="#a78bfa" />
                <h3 style={{ margin: 0, color: "#f8fafc" }}>Publish New Hackathon Challenge</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-grid-2">
                <div className="admin-field">
                  <label>HACKATHON TITLE *</label>
                  <input
                    type="text"
                    placeholder="e.g. Autonomous AI Hackathon 2026"
                    value={newHackathon.title}
                    onChange={(e) => setNewHackathon({ ...newHackathon, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>CATEGORY TRACK *</label>
                  <select
                    value={newHackathon.category}
                    onChange={(e) => setNewHackathon({ ...newHackathon, category: e.target.value })}
                  >
                    <option>AI/ML</option>
                    <option>Smart City</option>
                    <option>FinTech</option>
                    <option>Web3</option>
                    <option>Environment</option>
                    <option>Healthcare</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label>DESCRIPTION *</label>
                <textarea
                  rows="3"
                  placeholder="Challenge details, problem statements, and requirements..."
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-3">
                <div className="admin-field">
                  <label>PRIZE POOL</label>
                  <input
                    type="text"
                    placeholder="₹5,00,000"
                    value={newHackathon.prize}
                    onChange={(e) => setNewHackathon({ ...newHackathon, prize: e.target.value })}
                  />
                </div>

                <div className="admin-field">
                  <label>EVENT DATE</label>
                  <input
                    type="text"
                    placeholder="18 Oct 2026"
                    value={newHackathon.date}
                    onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
                  />
                </div>

                <div className="admin-field">
                  <label>DEADLINE</label>
                  <input
                    type="text"
                    placeholder="12 Oct 2026"
                    value={newHackathon.deadline}
                    onChange={(e) => setNewHackathon({ ...newHackathon, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="admin-field">
                  <label>LOCATION</label>
                  <input
                    type="text"
                    placeholder="Online / City"
                    value={newHackathon.location}
                    onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                  />
                </div>

                <div className="admin-field">
                  <label>DURATION</label>
                  <input
                    type="text"
                    placeholder="48 Hours"
                    value={newHackathon.duration}
                    onChange={(e) => setNewHackathon({ ...newHackathon, duration: e.target.value })}
                  />
                </div>

                <div className="admin-field">
                  <label>STATUS</label>
                  <select
                    value={newHackathon.status}
                    onChange={(e) => setNewHackathon({ ...newHackathon, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="publish-hackathon-submit-btn">
                <Plus size={18} /> Publish Live Challenge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
