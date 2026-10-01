import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Users,
  Search,
  ArrowLeft,
  UserCog,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  MapPin,
  Briefcase,
  TrendingUp,
  Star,
  Zap,
  Eye
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { developerAdminAPI } from "../../api/api";
import "./DeveloperAdminDashboard.css";

function DeveloperAdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState("developers");
  const [search, setSearch] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [stats, setStats] = useState({ totalDevelopers: 0, activeDevelopers: 0, profilesComplete: 0, totalUsers: 0 });
  const [activity, setActivity] = useState({ roleDistribution: {}, locationDistribution: {}, totalProfiles: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await developerAdminAPI.getStats();
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (e) { console.log("Using fallback stats"); }

    try {
      const devsRes = await developerAdminAPI.getDevelopers();
      if (devsRes.data.success && devsRes.data.data) setDevelopers(devsRes.data.data);
    } catch (e) {
      // Fallback demo data
      setDevelopers([
        { id: 1, fullName: "Sanika Pandhare", email: "sanika@example.com", primaryRole: "Full Stack Developer", location: "Pune, India", isActive: true, githubUrl: "https://github.com", profileComplete: true },
        { id: 2, fullName: "Priya Sharma", email: "priya@example.com", primaryRole: "UI/UX Designer", location: "Mumbai, India", isActive: true, profileComplete: true },
        { id: 3, fullName: "Rohan Mehta", email: "rohan@example.com", primaryRole: "ML Engineer", location: "Delhi, India", isActive: true, profileComplete: true },
        { id: 4, fullName: "Aman Khan", email: "aman@example.com", primaryRole: "DevOps Engineer", location: "Bangalore, India", isActive: true, profileComplete: true },
      ]);
      setStats({ totalDevelopers: 4, activeDevelopers: 4, profilesComplete: 4, totalUsers: 8 });
    }

    try {
      const actRes = await developerAdminAPI.getActivity();
      if (actRes.data.success) setActivity(actRes.data.data);
    } catch (e) {
      setActivity({
        roleDistribution: { "Full Stack Developer": 3, "ML Engineer": 2, "UI/UX Designer": 1, "DevOps Engineer": 2 },
        locationDistribution: { "Pune, India": 2, "Mumbai, India": 1, "Delhi, India": 1, "Bangalore, India": 1 },
        totalProfiles: 8
      });
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await developerAdminAPI.toggleStatus(userId);
      loadData();
    } catch (e) {
      setDevelopers(prev => prev.map(d =>
        d.id === userId ? { ...d, isActive: !d.isActive } : d
      ));
    }
  };

  const filteredDevs = developers.filter(d =>
    (d.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.primaryRole || "").toLowerCase().includes(search.toLowerCase())
  );

  const maxRoleCount = Math.max(...Object.values(activity.roleDistribution || { x: 1 }), 1);
  const maxLocationCount = Math.max(...Object.values(activity.locationDistribution || { x: 1 }), 1);

  return (
    <div className="devadmin-page">
      {/* TOPBAR */}
      <div className="devadmin-topbar">
        <div className="devadmin-brand">
          <div className="devadmin-badge-icon">
            <Code2 size={22} />
          </div>
          <div>
            <h1>Developer Admin Portal</h1>
            <span className="devadmin-subtext">
              Manage developer profiles, activity & technical resources
            </span>
          </div>
        </div>

        <div className="devadmin-topbar-actions">
          <button className="devadmin-back-btn" onClick={() => navigate("/student/dashboard")}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <section className="devadmin-kpi-grid">
        <div className="devadmin-kpi-card blue">
          <div className="devadmin-kpi-icon"><Users size={24} /></div>
          <div className="devadmin-kpi-info">
            <span className="devadmin-kpi-label">Total Developers</span>
            <strong className="devadmin-kpi-value">{stats.totalDevelopers}</strong>
            <small className="devadmin-kpi-delta">Registered on platform</small>
          </div>
        </div>
        <div className="devadmin-kpi-card green">
          <div className="devadmin-kpi-icon"><UserCheck size={24} /></div>
          <div className="devadmin-kpi-info">
            <span className="devadmin-kpi-label">Active Developers</span>
            <strong className="devadmin-kpi-value">{stats.activeDevelopers}</strong>
            <small className="devadmin-kpi-delta">Currently active</small>
          </div>
        </div>
        <div className="devadmin-kpi-card purple">
          <div className="devadmin-kpi-icon"><Star size={24} /></div>
          <div className="devadmin-kpi-info">
            <span className="devadmin-kpi-label">Profiles Complete</span>
            <strong className="devadmin-kpi-value">{stats.profilesComplete}</strong>
            <small className="devadmin-kpi-delta">Fully onboarded</small>
          </div>
        </div>
        <div className="devadmin-kpi-card orange">
          <div className="devadmin-kpi-icon"><TrendingUp size={24} /></div>
          <div className="devadmin-kpi-info">
            <span className="devadmin-kpi-label">Platform Users</span>
            <strong className="devadmin-kpi-value">{stats.totalUsers}</strong>
            <small className="devadmin-kpi-delta">All registered users</small>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="devadmin-tabs-bar">
        <button className={`devadmin-tab-btn ${activeTab === "developers" ? "active" : ""}`} onClick={() => setActiveTab("developers")}>
          <Users size={18} /> <span>Developer Profiles ({developers.length})</span>
        </button>
        <button className={`devadmin-tab-btn ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>
          <Activity size={18} /> <span>Developer Activity</span>
        </button>
        <button className={`devadmin-tab-btn ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
          <BarChart3 size={18} /> <span>Statistics</span>
        </button>
      </div>

      {/* TAB 1: DEVELOPER PROFILES */}
      {activeTab === "developers" && (
        <section className="devadmin-content-section">
          <div className="devadmin-table-toolbar">
            <div className="devadmin-search-box">
              <Search size={18} />
              <input type="text" placeholder="Search developers by name, email, role..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="devadmin-table-wrapper">
            <table className="devadmin-data-table">
              <thead>
                <tr>
                  <th>DEVELOPER</th>
                  <th>ROLE</th>
                  <th>LOCATION</th>
                  <th>PROFILE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="dev-user-cell">
                        <div className="dev-user-avatar">{(d.fullName || "D").charAt(0)}</div>
                        <div>
                          <strong>{d.fullName}</strong>
                          <small>{d.email}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="dev-role-badge">{d.primaryRole || "Developer"}</span></td>
                    <td><span className="dev-location"><MapPin size={13} /> {d.location || "—"}</span></td>
                    <td>
                      <span className={`dev-profile-badge ${d.profileComplete ? "complete" : "incomplete"}`}>
                        {d.profileComplete ? "✓ Complete" : "◌ Incomplete"}
                      </span>
                    </td>
                    <td>
                      <span className={`dev-status-pill ${d.isActive ? "active" : "suspended"}`}>
                        {d.isActive ? "✓ Active" : "⊘ Suspended"}
                      </span>
                    </td>
                    <td>
                      <div className="dev-action-group">
                        <button className="dev-action-btn view" title="View Profile">
                          <Eye size={15} />
                        </button>
                        <button
                          className={`dev-action-btn ${d.isActive ? "suspend" : "activate"}`}
                          onClick={() => handleToggleStatus(d.id)}
                          title={d.isActive ? "Suspend" : "Activate"}
                        >
                          {d.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
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

      {/* TAB 2: DEVELOPER ACTIVITY */}
      {activeTab === "activity" && (
        <section className="devadmin-content-section">
          <h2 className="devadmin-section-title">📊 Developer Activity & Distribution</h2>
          <div className="devadmin-analytics-grid">
            <div className="devadmin-analytics-card">
              <h3>🔧 Role Distribution</h3>
              <p>Breakdown of developer specializations</p>
              <div className="skill-metric-bars">
                {Object.entries(activity.roleDistribution || {}).map(([role, count]) => (
                  <div className="metric-row" key={role}>
                    <div className="metric-header"><span>{role}</span><small>{count}</small></div>
                    <div className="metric-bar"><div style={{ width: `${(count / maxRoleCount) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="devadmin-analytics-card">
              <h3>📍 Location Distribution</h3>
              <p>Where developers are based</p>
              <div className="skill-metric-bars">
                {Object.entries(activity.locationDistribution || {}).map(([loc, count]) => (
                  <div className="metric-row" key={loc}>
                    <div className="metric-header"><span>{loc}</span><small>{count}</small></div>
                    <div className="metric-bar"><div style={{ width: `${(count / maxLocationCount) * 100}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: STATISTICS */}
      {activeTab === "analytics" && (
        <section className="devadmin-content-section">
          <h2 className="devadmin-section-title">📈 Developer Statistics</h2>
          <div className="devadmin-analytics-grid">
            <div className="devadmin-analytics-card">
              <h3>🎯 Skill Demand Trends</h3>
              <p>Most requested skills by hackathon organizers</p>
              <div className="skill-metric-bars">
                {[
                  { skill: "React / Next.js", pct: 92 },
                  { skill: "Python & ML", pct: 88 },
                  { skill: "Spring Boot / Java", pct: 65 },
                  { skill: "Docker & DevOps", pct: 76 },
                  { skill: "PostgreSQL / DB", pct: 60 },
                ].map(item => (
                  <div className="metric-row" key={item.skill}>
                    <div className="metric-header"><span>{item.skill}</span><small>{item.pct}%</small></div>
                    <div className="metric-bar"><div style={{ width: `${item.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="devadmin-analytics-card">
              <h3>🏆 Top Performing Developers</h3>
              <p>Developers with highest hackathon participation</p>
              <div className="skill-metric-bars">
                {[
                  { name: "Sanika Pandhare", score: 94 },
                  { name: "Rohan Mehta", score: 88 },
                  { name: "Priya Sharma", score: 82 },
                  { name: "Aman Khan", score: 76 },
                ].map(item => (
                  <div className="metric-row" key={item.name}>
                    <div className="metric-header"><span>{item.name}</span><small>{item.score} pts</small></div>
                    <div className="metric-bar"><div style={{ width: `${item.score}%`, background: "linear-gradient(90deg, #10b981, #34d399)" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default DeveloperAdminDashboard;
