import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Trophy,
  Users,
  Plus,
  Search,
  Trash2,
  ArrowLeft,
  X,
  Megaphone,
  Send,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Edit3,
  FileText,
  BarChart3,
  UserPlus,
  Mail,
  Globe,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Star,
  MessageCircle,
  ClipboardList
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { hackathonAdminAPI } from "../../api/api";
import "./HackathonAdminDashboard.css";

function HackathonAdminDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    hackathons,
    addHackathon,
    deleteHackathon,
    updateHackathonStatus,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState("my-hackathons");
  const [hackathonSearch, setHackathonSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      hackathonTitle: "AI Innovation Challenge 2026",
      title: "Registration Deadline Extended!",
      message: "Due to popular demand, we've extended the registration deadline by 5 days. Last date: 20 Aug 2026.",
      type: "info",
      sentAt: "2026-09-28 10:30 AM",
      recipients: 1240
    },
    {
      id: 2,
      hackathonTitle: "Smart City Hackathon",
      title: "Venue Change Notification",
      message: "The hackathon venue has been changed to IIT Bombay campus. Updated maps will be shared soon.",
      type: "warning",
      sentAt: "2026-09-27 03:15 PM",
      recipients: 860
    },
    {
      id: 3,
      hackathonTitle: "FinTech Challenge",
      title: "Mentors Announced!",
      message: "We're excited to announce 12 industry mentors from RazorPay, PayTM, and PhonePe for this hackathon.",
      type: "success",
      sentAt: "2026-09-26 11:00 AM",
      recipients: 720
    }
  ]);

  const [newHackathon, setNewHackathon] = useState({
    title: "",
    category: "AI/ML",
    description: "",
    prize: "₹3,00,000",
    date: "",
    deadline: "",
    location: "Online",
    duration: "48 Hours",
    participants: 0,
    status: "Open",
    level: "All Levels",
    organizer: currentUser?.fullName || "Hackathon Admin",
    rules: "",
    judgingCriteria: "",
    contactEmail: currentUser?.email || ""
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    hackathonId: "",
    title: "",
    message: "",
    type: "info"
  });

  // Stats computed from data
  const myHackathons = hackathons;
  const totalParticipants = hackathons.reduce((sum, h) => sum + (h.participants || 0), 0);
  const openHackathons = hackathons.filter(h => h.status === "Open").length;
  const closedHackathons = hackathons.filter(h => h.status === "Closed").length;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newHackathon.title.trim()) return;

    addHackathon(newHackathon);
    addNotification({
      type: "hackathon",
      icon: "📢",
      title: `Hackathon Published: "${newHackathon.title}"`,
      message: `Your hackathon "${newHackathon.title}" is now live and accepting registrations.`,
      action: "View Hackathon",
      route: "/hackathons"
    });
    setNewHackathon({
      title: "", category: "AI/ML", description: "", prize: "₹3,00,000",
      date: "", deadline: "", location: "Online", duration: "48 Hours",
      participants: 0, status: "Open", level: "All Levels",
      organizer: currentUser?.fullName || "Hackathon Admin",
      rules: "", judgingCriteria: "", contactEmail: currentUser?.email || ""
    });
    setShowCreateModal(false);
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) return;

    const targetHackathon = hackathons.find(h => String(h.id) === String(newAnnouncement.hackathonId));
    const announcement = {
      id: Date.now(),
      hackathonTitle: targetHackathon?.title || "All Hackathons",
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      type: newAnnouncement.type,
      sentAt: new Date().toLocaleString(),
      recipients: targetHackathon?.participants || totalParticipants
    };

    setAnnouncements(prev => [announcement, ...prev]);
    addNotification({
      type: "hackathon",
      icon: "📢",
      title: `Announcement: ${announcement.title}`,
      message: announcement.message,
      action: "View",
      route: "/hackathon-admin"
    });

    // Try backend
    try {
      hackathonAdminAPI.sendAnnouncement({
        hackathonId: newAnnouncement.hackathonId || null,
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        type: newAnnouncement.type
      });
    } catch (e) { /* fallback ok */ }

    setNewAnnouncement({ hackathonId: "", title: "", message: "", type: "info" });
    setShowAnnouncementModal(false);
  };

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
      h.category.toLowerCase().includes(hackathonSearch.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "warning": return "⚠️";
      case "success": return "✅";
      case "error": return "🚨";
      default: return "ℹ️";
    }
  };

  return (
    <div className="hackadmin-page">
      {/* TOPBAR */}
      <div className="hackadmin-topbar">
        <div className="hackadmin-brand">
          <div className="hackadmin-badge-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1>Hackathon Admin Portal</h1>
            <span className="hackadmin-subtext">
              Manage your hackathons, registrations & announcements
            </span>
          </div>
        </div>

        <div className="hackadmin-topbar-actions">
          <button className="hackadmin-back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <button className="hackadmin-announce-btn" onClick={() => setShowAnnouncementModal(true)}>
            <Megaphone size={16} />
            <span>Send Announcement</span>
          </button>
          <button className="hackadmin-create-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            <span>New Hackathon</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <section className="hackadmin-kpi-grid">
        <div className="hackadmin-kpi-card teal">
          <div className="hackadmin-kpi-icon"><Trophy size={24} /></div>
          <div className="hackadmin-kpi-info">
            <span className="hackadmin-kpi-label">My Hackathons</span>
            <strong className="hackadmin-kpi-value">{hackathons.length}</strong>
            <small className="hackadmin-kpi-delta">{openHackathons} open · {closedHackathons} closed</small>
          </div>
        </div>

        <div className="hackadmin-kpi-card indigo">
          <div className="hackadmin-kpi-icon"><Users size={24} /></div>
          <div className="hackadmin-kpi-info">
            <span className="hackadmin-kpi-label">Total Participants</span>
            <strong className="hackadmin-kpi-value">{totalParticipants.toLocaleString()}</strong>
            <small className="hackadmin-kpi-delta">Across all events</small>
          </div>
        </div>

        <div className="hackadmin-kpi-card amber">
          <div className="hackadmin-kpi-icon"><Megaphone size={24} /></div>
          <div className="hackadmin-kpi-info">
            <span className="hackadmin-kpi-label">Announcements Sent</span>
            <strong className="hackadmin-kpi-value">{announcements.length}</strong>
            <small className="hackadmin-kpi-delta">Reach: {totalParticipants.toLocaleString()}+ users</small>
          </div>
        </div>

        <div className="hackadmin-kpi-card emerald">
          <div className="hackadmin-kpi-icon"><TrendingUp size={24} /></div>
          <div className="hackadmin-kpi-info">
            <span className="hackadmin-kpi-label">Engagement Rate</span>
            <strong className="hackadmin-kpi-value">87.4%</strong>
            <small className="hackadmin-kpi-delta">↑ 12% this month</small>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="hackadmin-tabs-bar">
        <button
          className={`hackadmin-tab-btn ${activeTab === "my-hackathons" ? "active" : ""}`}
          onClick={() => setActiveTab("my-hackathons")}
        >
          <Trophy size={18} />
          <span>My Hackathons ({hackathons.length})</span>
        </button>
        <button
          className={`hackadmin-tab-btn ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          <Megaphone size={18} />
          <span>Announcements ({announcements.length})</span>
        </button>
        <button
          className={`hackadmin-tab-btn ${activeTab === "registrations" ? "active" : ""}`}
          onClick={() => setActiveTab("registrations")}
        >
          <ClipboardList size={18} />
          <span>Registration Overview</span>
        </button>
        <button
          className={`hackadmin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>
      </div>

      {/* TAB 1: MY HACKATHONS */}
      {activeTab === "my-hackathons" && (
        <section className="hackadmin-content-section">
          <div className="hackadmin-table-toolbar">
            <div className="hackadmin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search your hackathons..."
                value={hackathonSearch}
                onChange={(e) => setHackathonSearch(e.target.value)}
              />
            </div>
            <button className="hackadmin-primary-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} /> Create New Hackathon
            </button>
          </div>

          <div className="hackadmin-cards-grid">
            {filteredHackathons.map((h) => (
              <div key={h.id} className="hackadmin-event-card">
                <div className="event-card-header">
                  <span className="event-icon">{h.icon || "🏆"}</span>
                  <span className={`event-status-pill ${h.status.toLowerCase()}`}>{h.status}</span>
                </div>
                <h3 className="event-title">{h.title}</h3>
                <p className="event-desc">{h.description?.substring(0, 100)}...</p>
                <div className="event-meta-grid">
                  <div className="event-meta-item">
                    <Calendar size={14} />
                    <span>{h.date || "TBD"}</span>
                  </div>
                  <div className="event-meta-item">
                    <MapPin size={14} />
                    <span>{h.location}</span>
                  </div>
                  <div className="event-meta-item">
                    <Clock size={14} />
                    <span>{h.duration}</span>
                  </div>
                  <div className="event-meta-item">
                    <Users size={14} />
                    <span>{h.participants || 0} registered</span>
                  </div>
                </div>
                <div className="event-card-actions">
                  <select
                    className={`event-status-select ${h.status.toLowerCase()}`}
                    value={h.status}
                    onChange={(e) => updateHackathonStatus(h.id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                  <button
                    className="event-action-btn announce"
                    onClick={() => {
                      setNewAnnouncement({ ...newAnnouncement, hackathonId: String(h.id) });
                      setShowAnnouncementModal(true);
                    }}
                    title="Send Announcement"
                  >
                    <Megaphone size={15} />
                  </button>
                  <button
                    className="event-action-btn delete"
                    onClick={() => {
                      if (window.confirm(`Delete "${h.title}"?`)) deleteHackathon(h.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <section className="hackadmin-content-section">
          <div className="hackadmin-table-toolbar">
            <h2 className="section-title-text">📢 Broadcast History</h2>
            <button className="hackadmin-primary-btn" onClick={() => setShowAnnouncementModal(true)}>
              <Send size={16} /> New Announcement
            </button>
          </div>

          <div className="announcements-list">
            {announcements.map((a) => (
              <div key={a.id} className={`announcement-card ${a.type}`}>
                <div className="announcement-header">
                  <span className="announcement-type-icon">{getTypeIcon(a.type)}</span>
                  <div className="announcement-meta">
                    <strong>{a.title}</strong>
                    <small>{a.hackathonTitle} · {a.sentAt}</small>
                  </div>
                  <span className="announcement-recipients">
                    <Users size={14} /> {a.recipients.toLocaleString()} recipients
                  </span>
                </div>
                <p className="announcement-body">{a.message}</p>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="empty-state">
                <Megaphone size={48} />
                <h3>No announcements yet</h3>
                <p>Send your first announcement to hackathon participants</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: REGISTRATION OVERVIEW */}
      {activeTab === "registrations" && (
        <section className="hackadmin-content-section">
          <h2 className="section-title-text">📋 Registration Summary</h2>
          <div className="hackadmin-table-wrapper">
            <table className="hackadmin-data-table">
              <thead>
                <tr>
                  <th>HACKATHON</th>
                  <th>CATEGORY</th>
                  <th>REGISTRATIONS</th>
                  <th>STATUS</th>
                  <th>DEADLINE</th>
                  <th>FILL RATE</th>
                </tr>
              </thead>
              <tbody>
                {hackathons.map((h) => {
                  const fillRate = Math.min(100, Math.round(((h.participants || 0) / 1500) * 100));
                  return (
                    <tr key={h.id}>
                      <td>
                        <div className="table-title-cell">
                          <span className="table-icon">{h.icon || "🏆"}</span>
                          <strong>{h.title}</strong>
                        </div>
                      </td>
                      <td><span className="track-badge">{h.category}</span></td>
                      <td><strong>{(h.participants || 0).toLocaleString()}</strong></td>
                      <td>
                        <span className={`event-status-pill ${h.status.toLowerCase()}`}>{h.status}</span>
                      </td>
                      <td>{h.deadline || "TBD"}</td>
                      <td>
                        <div className="fill-rate-bar">
                          <div className="fill-rate-progress" style={{ width: `${fillRate}%` }} />
                          <span>{fillRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === "analytics" && (
        <section className="hackadmin-content-section">
          <div className="hackadmin-analytics-grid">
            <div className="hackadmin-analytics-card">
              <h3>🎯 Category Breakdown</h3>
              <p>Distribution of your hackathons by domain track</p>
              <div className="skill-metric-bars">
                {[
                  { domain: "AI / ML", pct: 35, color: "#8b5cf6" },
                  { domain: "Smart City & IoT", pct: 20, color: "#06b6d4" },
                  { domain: "FinTech & Web3", pct: 25, color: "#f59e0b" },
                  { domain: "HealthTech", pct: 10, color: "#ec4899" },
                  { domain: "GreenTech", pct: 10, color: "#10b981" }
                ].map((item) => (
                  <div className="metric-row" key={item.domain}>
                    <div className="metric-header">
                      <span>{item.domain}</span>
                      <small>{item.pct}%</small>
                    </div>
                    <div className="metric-bar">
                      <div style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hackadmin-analytics-card">
              <h3>📈 Registration Trends</h3>
              <p>Participant growth over the last 6 months</p>
              <div className="skill-metric-bars">
                {[
                  { month: "May 2026", pct: 45, count: "1,200" },
                  { month: "Jun 2026", pct: 58, count: "1,580" },
                  { month: "Jul 2026", pct: 72, count: "2,100" },
                  { month: "Aug 2026", pct: 85, count: "2,800" },
                  { month: "Sep 2026", pct: 92, count: "3,400" },
                  { month: "Oct 2026", pct: 78, count: "2,600" }
                ].map((item) => (
                  <div className="metric-row" key={item.month}>
                    <div className="metric-header">
                      <span>{item.month}</span>
                      <small>{item.count} registrations</small>
                    </div>
                    <div className="metric-bar">
                      <div style={{ width: `${item.pct}%` }} />
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
          <div className="hackadmin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Trophy size={22} color="#14b8a6" />
                <h3 style={{ margin: 0 }}>Create New Hackathon Event</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-grid-2">
                <div className="hackadmin-field">
                  <label>HACKATHON TITLE *</label>
                  <input
                    type="text"
                    placeholder="e.g. AI Innovation Sprint 2026"
                    value={newHackathon.title}
                    onChange={(e) => setNewHackathon({ ...newHackathon, title: e.target.value })}
                    required
                  />
                </div>
                <div className="hackadmin-field">
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
                    <option>EdTech</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
              </div>

              <div className="hackadmin-field">
                <label>DESCRIPTION *</label>
                <textarea
                  rows="3"
                  placeholder="Describe your hackathon challenge, problem statements..."
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-3">
                <div className="hackadmin-field">
                  <label>PRIZE POOL</label>
                  <input
                    type="text"
                    placeholder="₹5,00,000"
                    value={newHackathon.prize}
                    onChange={(e) => setNewHackathon({ ...newHackathon, prize: e.target.value })}
                  />
                </div>
                <div className="hackadmin-field">
                  <label>EVENT DATE</label>
                  <input
                    type="text"
                    placeholder="18 Oct 2026"
                    value={newHackathon.date}
                    onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
                  />
                </div>
                <div className="hackadmin-field">
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
                <div className="hackadmin-field">
                  <label>LOCATION</label>
                  <input
                    type="text"
                    placeholder="Online / City Name"
                    value={newHackathon.location}
                    onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                  />
                </div>
                <div className="hackadmin-field">
                  <label>DURATION</label>
                  <input
                    type="text"
                    placeholder="48 Hours"
                    value={newHackathon.duration}
                    onChange={(e) => setNewHackathon({ ...newHackathon, duration: e.target.value })}
                  />
                </div>
                <div className="hackadmin-field">
                  <label>LEVEL</label>
                  <select
                    value={newHackathon.level}
                    onChange={(e) => setNewHackathon({ ...newHackathon, level: e.target.value })}
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="hackadmin-field">
                <label>RULES & GUIDELINES</label>
                <textarea
                  rows="2"
                  placeholder="Team size, technology constraints, submission rules..."
                  value={newHackathon.rules}
                  onChange={(e) => setNewHackathon({ ...newHackathon, rules: e.target.value })}
                />
              </div>

              <button type="submit" className="hackadmin-submit-btn">
                <Plus size={18} /> Publish Hackathon Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
          <div className="hackadmin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Megaphone size={22} color="#f59e0b" />
                <h3 style={{ margin: 0 }}>Broadcast Announcement</h3>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAnnouncementSubmit}>
              <div className="hackadmin-field">
                <label>TARGET HACKATHON</label>
                <select
                  value={newAnnouncement.hackathonId}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, hackathonId: e.target.value })}
                >
                  <option value="">All Hackathons (Broadcast)</option>
                  {hackathons.map(h => (
                    <option key={h.id} value={h.id}>{h.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="hackadmin-field">
                  <label>ANNOUNCEMENT TITLE *</label>
                  <input
                    type="text"
                    placeholder="e.g. Deadline Extended!"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    required
                  />
                </div>
                <div className="hackadmin-field">
                  <label>TYPE</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  >
                    <option value="info">ℹ️ Information</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="success">✅ Success</option>
                    <option value="error">🚨 Urgent</option>
                  </select>
                </div>
              </div>

              <div className="hackadmin-field">
                <label>MESSAGE *</label>
                <textarea
                  rows="4"
                  placeholder="Write your announcement message to all participants..."
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="hackadmin-submit-btn announce-submit">
                <Send size={18} /> Send Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HackathonAdminDashboard;
