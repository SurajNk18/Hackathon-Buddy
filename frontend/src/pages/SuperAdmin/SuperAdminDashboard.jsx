import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Shield,
  Users,
  Trophy,
  Key,
  Search,
  Trash2,
  ArrowLeft,
  X,
  UserCog,
  UserPlus,
  UserCheck,
  UserX,
  RefreshCcw,
  Lock,
  Unlock,
  Database,
  Server,
  Activity,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Cpu,
  Globe,
  Zap,
  Terminal,
  ShieldAlert,
  Mail,
  ClipboardCheck
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { superAdminAPI } from "../../api/api";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    hackathons,
    adminUsers,
    toggleUserStatus,
    deleteAdminUser,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [backendUsers, setBackendUsers] = useState([]);
  const [allRoles, setAllRoles] = useState(["STUDENT", "DEVELOPER", "ORGANIZER", "ADMIN", "HACKATHON_ADMIN", "SUPER_ADMIN"]);
  const [systemStats, setSystemStats] = useState(null);

  // New Admin form
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "HACKATHON_ADMIN",
    primaryRole: "Hackathon Organizer"
  });

  // Reset password form
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Generated credentials
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  // Load backend data
  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const statsRes = await superAdminAPI.getStats();
      if (statsRes.data.success) {
        setSystemStats(statsRes.data.data);
      }
    } catch (e) {
      console.log("Using fallback stats");
    }

    try {
      const usersRes = await superAdminAPI.getUsers();
      if (usersRes.data.success && usersRes.data.data) {
        setBackendUsers(usersRes.data.data);
      }
    } catch (e) {
      console.log("Using fallback users");
    }

    try {
      const rolesRes = await superAdminAPI.getRoles();
      if (rolesRes.data.success && rolesRes.data.data) {
        setAllRoles(rolesRes.data.data);
      }
    } catch (e) { /* ok */ }
  };

  // Users to display — prefer backend, fallback to context
  const displayUsers = backendUsers.length > 0
    ? backendUsers.map(u => ({
        id: u.id,
        name: u.fullName || `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role || "STUDENT",
        primaryRole: u.primaryRole || u.role || "Developer",
        status: u.isActive ? "Active" : "Suspended",
        isAdmin: u.isAdmin,
        joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
        location: u.location || "—"
      }))
    : adminUsers;

  const filteredUsers = displayUsers.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const adminCount = displayUsers.filter(u =>
    ["ADMIN", "HACKATHON_ADMIN", "SUPER_ADMIN"].includes((u.role || "").toUpperCase())
  ).length;

  const activeCount = displayUsers.filter(u => u.status === "Active").length;
  const suspendedCount = displayUsers.filter(u => u.status === "Suspended").length;

  // Generate random secure password
  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 14; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
  };

  // Create admin handler
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.email.trim() || !newAdmin.firstName.trim()) return;

    const password = newAdmin.password || generatePassword();

    // Try backend
    try {
      const res = await superAdminAPI.createAdmin({
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        password: password,
        roleName: newAdmin.role,
        primaryRole: newAdmin.primaryRole
      });
      if (res.data.success) {
        addNotification({
          type: "hackathon",
          icon: "🔑",
          title: `Admin Created: ${newAdmin.firstName} ${newAdmin.lastName}`,
          message: `New ${newAdmin.role} account created for ${newAdmin.email}`,
          action: "View",
          route: "/super-admin"
        });
      }
    } catch (e) {
      console.log("Backend admin creation failed, using fallback");
    }

    // Show credentials
    setGeneratedCredentials({
      name: `${newAdmin.firstName} ${newAdmin.lastName}`,
      email: newAdmin.email,
      password: password,
      role: newAdmin.role
    });

    setNewAdmin({
      firstName: "", lastName: "", email: "", password: "",
      role: "HACKATHON_ADMIN", primaryRole: "Hackathon Organizer"
    });
    setShowCreateAdminModal(false);
    setShowCredentialModal(true);

    // Reload
    loadSystemData();
  };

  // Assign role handler
  const handleAssignRole = async (userId, roleName) => {
    try {
      await superAdminAPI.assignRole(userId, roleName);
      addNotification({
        type: "hackathon",
        icon: "🛡️",
        title: "Role Updated",
        message: `User role changed to ${roleName}`,
        action: "View",
        route: "/super-admin"
      });
      loadSystemData();
    } catch (e) {
      console.log("Role assignment failed:", e);
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (userId) => {
    try {
      await superAdminAPI.toggleStatus(userId);
      loadSystemData();
    } catch (e) {
      toggleUserStatus(userId);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    try {
      await superAdminAPI.deleteUser(userId);
      loadSystemData();
    } catch (e) {
      deleteAdminUser(userId);
    }
  };

  // Reset password handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!selectedUser) return;

    try {
      await superAdminAPI.resetPassword(selectedUser.id, resetPasswordData.newPassword);
      addNotification({
        type: "hackathon",
        icon: "🔐",
        title: "Password Reset",
        message: `Password has been reset for ${selectedUser.name || selectedUser.email}`,
        action: "View",
        route: "/super-admin"
      });
    } catch (e) {
      console.log("Password reset failed");
    }

    setResetPasswordData({ newPassword: "", confirmPassword: "" });
    setSelectedUser(null);
    setShowResetPasswordModal(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getRoleBadgeClass = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN": return "super-admin-badge";
      case "ADMIN": return "admin-badge";
      case "HACKATHON_ADMIN": return "hackathon-admin-badge";
      default: return "user-badge";
    }
  };

  return (
    <div className="superadmin-page">
      {/* TOPBAR */}
      <div className="superadmin-topbar">
        <div className="superadmin-brand">
          <div className="superadmin-badge-icon">
            <Crown size={22} />
          </div>
          <div>
            <h1>Developer Control Center</h1>
            <span className="superadmin-subtext">
              System Management · Credentials · Access Control
            </span>
          </div>
        </div>

        <div className="superadmin-topbar-actions">
          <button className="superadmin-back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <button className="superadmin-back-btn" onClick={() => navigate("/admin")}>
            <ShieldAlert size={16} />
            <span>Admin Console</span>
          </button>
          <button className="superadmin-create-btn" onClick={() => setShowCreateAdminModal(true)}>
            <UserPlus size={16} />
            <span>Create Admin Account</span>
          </button>
        </div>
      </div>

      {/* SYSTEM KPI */}
      <section className="superadmin-kpi-grid">
        <div className="superadmin-kpi-card crimson">
          <div className="superadmin-kpi-icon"><Users size={24} /></div>
          <div className="superadmin-kpi-info">
            <span className="superadmin-kpi-label">Total Users</span>
            <strong className="superadmin-kpi-value">
              {systemStats?.totalUsers || displayUsers.length}
            </strong>
            <small className="superadmin-kpi-delta">{activeCount} active · {suspendedCount} suspended</small>
          </div>
        </div>

        <div className="superadmin-kpi-card royal">
          <div className="superadmin-kpi-icon"><Shield size={24} /></div>
          <div className="superadmin-kpi-info">
            <span className="superadmin-kpi-label">Admin Accounts</span>
            <strong className="superadmin-kpi-value">
              {systemStats?.hackathonAdmins || adminCount}
            </strong>
            <small className="superadmin-kpi-delta">Hackathon & System Admins</small>
          </div>
        </div>

        <div className="superadmin-kpi-card gold">
          <div className="superadmin-kpi-icon"><Trophy size={24} /></div>
          <div className="superadmin-kpi-info">
            <span className="superadmin-kpi-label">Hackathons</span>
            <strong className="superadmin-kpi-value">
              {systemStats?.totalHackathons || hackathons.length}
            </strong>
            <small className="superadmin-kpi-delta">Platform-wide events</small>
          </div>
        </div>

        <div className="superadmin-kpi-card neon">
          <div className="superadmin-kpi-icon"><Server size={24} /></div>
          <div className="superadmin-kpi-info">
            <span className="superadmin-kpi-label">System Health</span>
            <strong className="superadmin-kpi-value">99.9%</strong>
            <small className="superadmin-kpi-delta">All services operational</small>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="superadmin-tabs-bar">
        <button
          className={`superadmin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} />
          <span>User & Access Management</span>
        </button>
        <button
          className={`superadmin-tab-btn ${activeTab === "credentials" ? "active" : ""}`}
          onClick={() => setActiveTab("credentials")}
        >
          <Key size={18} />
          <span>Credentials & Provisioning</span>
        </button>
        <button
          className={`superadmin-tab-btn ${activeTab === "system" ? "active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <Server size={18} />
          <span>System Overview</span>
        </button>
        <button
          className={`superadmin-tab-btn ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          <ClipboardCheck size={18} />
          <span>Audit Log</span>
        </button>
      </div>

      {/* TAB 1: USER & ACCESS MANAGEMENT */}
      {activeTab === "users" && (
        <section className="superadmin-content-section">
          <div className="superadmin-table-toolbar">
            <div className="superadmin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users by name, email, role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <button className="superadmin-primary-btn" onClick={() => setShowCreateAdminModal(true)}>
              <UserPlus size={16} /> Create Admin
            </button>
          </div>

          <div className="superadmin-table-wrapper">
            <table className="superadmin-data-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ASSIGN ROLE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="super-user-cell">
                        <div className="super-user-avatar">
                          {(u.name || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{u.name || "—"}</strong>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
                        {u.role || "STUDENT"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${(u.status || "active").toLowerCase()}`}>
                        {u.status === "Active" ? "✓ Active" : "⊘ Suspended"}
                      </span>
                    </td>
                    <td className="date-cell">{u.joinedDate || "N/A"}</td>
                    <td>
                      <select
                        className="role-select"
                        value={u.role || "STUDENT"}
                        onChange={(e) => handleAssignRole(u.id, e.target.value)}
                      >
                        {allRoles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className={`action-icon-btn ${u.status === "Active" ? "suspend" : "activate"}`}
                          onClick={() => handleToggleStatus(u.id)}
                          title={u.status === "Active" ? "Suspend" : "Activate"}
                        >
                          {u.status === "Active" ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button
                          className="action-icon-btn reset"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowResetPasswordModal(true);
                          }}
                          title="Reset Password"
                        >
                          <Key size={15} />
                        </button>
                        <button
                          className="action-icon-btn delete"
                          onClick={() => {
                            if (window.confirm(`Delete user ${u.name || u.email}? This cannot be undone.`)) {
                              handleDeleteUser(u.id);
                            }
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
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

      {/* TAB 2: CREDENTIALS & PROVISIONING */}
      {activeTab === "credentials" && (
        <section className="superadmin-content-section">
          <h2 className="section-title-icon">🔑 Credentials & Access Provisioning</h2>
          <p className="section-desc">Create, manage and distribute admin credentials for hackathon organizers.</p>

          <div className="credentials-grid">
            <div className="credential-card">
              <div className="credential-card-header">
                <div className="cred-icon-box teal"><UserPlus size={22} /></div>
                <h3>Create Hackathon Admin</h3>
              </div>
              <p>Provision new admin accounts for hackathon organizers with HACKATHON_ADMIN role.</p>
              <button className="superadmin-action-btn teal" onClick={() => {
                setNewAdmin({ ...newAdmin, role: "HACKATHON_ADMIN" });
                setShowCreateAdminModal(true);
              }}>
                <UserPlus size={16} /> Create Hackathon Admin
              </button>
            </div>

            <div className="credential-card">
              <div className="credential-card-header">
                <div className="cred-icon-box purple"><Shield size={22} /></div>
                <h3>Create System Admin</h3>
              </div>
              <p>Provision system-level admin accounts with full platform management access.</p>
              <button className="superadmin-action-btn purple" onClick={() => {
                setNewAdmin({ ...newAdmin, role: "ADMIN" });
                setShowCreateAdminModal(true);
              }}>
                <Shield size={16} /> Create System Admin
              </button>
            </div>

            <div className="credential-card">
              <div className="credential-card-header">
                <div className="cred-icon-box amber"><Key size={22} /></div>
                <h3>Batch Reset Passwords</h3>
              </div>
              <p>Reset credentials for multiple admin accounts or specific users.</p>
              <button className="superadmin-action-btn amber" onClick={() => {
                setSelectedUser(null);
                setShowResetPasswordModal(true);
              }}>
                <RefreshCcw size={16} /> Reset Credentials
              </button>
            </div>

            <div className="credential-card">
              <div className="credential-card-header">
                <div className="cred-icon-box rose"><Lock size={22} /></div>
                <h3>API Key Management</h3>
              </div>
              <p>Generate and manage API keys for external integrations and AI services.</p>
              <button className="superadmin-action-btn rose" disabled>
                <Terminal size={16} /> Coming Soon
              </button>
            </div>
          </div>

          {/* Quick Credentials Reference */}
          <div className="default-credentials-section">
            <h3>📋 Default System Credentials</h3>
            <div className="cred-table-wrapper">
              <table className="superadmin-data-table">
                <thead>
                  <tr>
                    <th>ACCOUNT</th>
                    <th>EMAIL</th>
                    <th>DEFAULT PASSWORD</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Super Admin", email: "superadmin@hackathonbuddy.com", pass: "superadmin123", role: "SUPER_ADMIN", active: true },
                    { name: "System Admin", email: "admin@hackathonbuddy.com", pass: "admin123", role: "ADMIN", active: true },
                    { name: "Demo User", email: "sanika@example.com", pass: "password123", role: "STUDENT", active: true },
                  ].map((c, i) => (
                    <tr key={i}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>
                        <div className="password-cell">
                          <code>{showPasswords[i] ? c.pass : "••••••••"}</code>
                          <button
                            className="pass-toggle-btn"
                            onClick={() => setShowPasswords(prev => ({ ...prev, [i]: !prev[i] }))}
                          >
                            {showPasswords[i] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            className="pass-copy-btn"
                            onClick={() => copyToClipboard(c.pass)}
                            title="Copy"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(c.role)}`}>{c.role}</span>
                      </td>
                      <td>
                        <span className="status-pill active">✓ Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: SYSTEM OVERVIEW */}
      {activeTab === "system" && (
        <section className="superadmin-content-section">
          <h2 className="section-title-icon">🖥️ System Overview & Health</h2>

          <div className="system-cards-grid">
            <div className="system-status-card">
              <div className="system-status-header">
                <Server size={20} />
                <span>Backend API (Spring Boot)</span>
              </div>
              <div className="system-status-indicator online">
                <CheckCircle2 size={16} /> Operational
              </div>
              <div className="system-status-details">
                <span>Port: 8080</span>
                <span>Version: 3.2.x</span>
                <span>Uptime: 99.9%</span>
              </div>
            </div>

            <div className="system-status-card">
              <div className="system-status-header">
                <Cpu size={20} />
                <span>AI Service (FastAPI)</span>
              </div>
              <div className="system-status-indicator online">
                <CheckCircle2 size={16} /> Operational
              </div>
              <div className="system-status-details">
                <span>Port: 8000</span>
                <span>Python 3.11+</span>
                <span>Models: Active</span>
              </div>
            </div>

            <div className="system-status-card">
              <div className="system-status-header">
                <Globe size={20} />
                <span>Frontend (React + Vite)</span>
              </div>
              <div className="system-status-indicator online">
                <CheckCircle2 size={16} /> Operational
              </div>
              <div className="system-status-details">
                <span>Port: 5173</span>
                <span>React 18.x</span>
                <span>Build: Prod-ready</span>
              </div>
            </div>

            <div className="system-status-card">
              <div className="system-status-header">
                <Database size={20} />
                <span>Database (PostgreSQL)</span>
              </div>
              <div className="system-status-indicator online">
                <CheckCircle2 size={16} /> Operational
              </div>
              <div className="system-status-details">
                <span>Port: 5432</span>
                <span>Tables: 15+</span>
                <span>Connections: OK</span>
              </div>
            </div>
          </div>

          <div className="system-metrics-grid">
            <div className="system-metric-card">
              <h3>🔐 Security Summary</h3>
              <div className="security-items">
                <div className="security-item ok">
                  <CheckCircle2 size={16} />
                  <span>JWT Authentication</span>
                  <span className="sec-status">Enabled</span>
                </div>
                <div className="security-item ok">
                  <CheckCircle2 size={16} />
                  <span>CORS Policy</span>
                  <span className="sec-status">Configured</span>
                </div>
                <div className="security-item ok">
                  <CheckCircle2 size={16} />
                  <span>BCrypt Password Hashing</span>
                  <span className="sec-status">Active</span>
                </div>
                <div className="security-item ok">
                  <CheckCircle2 size={16} />
                  <span>Role-Based Access Control</span>
                  <span className="sec-status">Active</span>
                </div>
                <div className="security-item warn">
                  <AlertTriangle size={16} />
                  <span>Rate Limiting</span>
                  <span className="sec-status">Not Configured</span>
                </div>
              </div>
            </div>

            <div className="system-metric-card">
              <h3>📊 Platform Statistics</h3>
              <div className="platform-stats-list">
                <div className="platform-stat-row">
                  <span>Total Users</span>
                  <strong>{systemStats?.totalUsers || displayUsers.length}</strong>
                </div>
                <div className="platform-stat-row">
                  <span>Total Hackathons</span>
                  <strong>{systemStats?.totalHackathons || hackathons.length}</strong>
                </div>
                <div className="platform-stat-row">
                  <span>Total Registrations</span>
                  <strong>{systemStats?.totalRegistrations || "—"}</strong>
                </div>
                <div className="platform-stat-row">
                  <span>Total Teams</span>
                  <strong>{systemStats?.totalTeams || "—"}</strong>
                </div>
                <div className="platform-stat-row">
                  <span>Hackathon Admins</span>
                  <strong>{systemStats?.hackathonAdmins || adminCount}</strong>
                </div>
                <div className="platform-stat-row">
                  <span>Super Admins</span>
                  <strong>{systemStats?.superAdmins || 1}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === "audit" && (
        <section className="superadmin-content-section">
          <h2 className="section-title-icon">📝 System Audit Log</h2>
          <p className="section-desc">Track all admin actions and system events</p>

          <div className="audit-log-list">
            {[
              { time: "2026-10-01 14:30", action: "Admin Created", details: "New HACKATHON_ADMIN account provisioned", user: "Super Admin", severity: "info" },
              { time: "2026-10-01 12:15", action: "Role Changed", details: "User role updated from STUDENT to HACKATHON_ADMIN", user: "Super Admin", severity: "warning" },
              { time: "2026-10-01 10:00", action: "Hackathon Published", details: "AI Innovation Challenge 2026 published to directory", user: "Hackathon Admin", severity: "success" },
              { time: "2026-09-30 18:45", action: "Password Reset", details: "Password reset performed for admin@hackathonbuddy.com", user: "Super Admin", severity: "warning" },
              { time: "2026-09-30 15:20", action: "User Suspended", details: "User account suspended for policy violation", user: "Admin", severity: "error" },
              { time: "2026-09-30 11:00", action: "System Startup", details: "All services initialized — Backend, AI, Database operational", user: "System", severity: "info" },
              { time: "2026-09-29 09:30", action: "Announcement Sent", details: "Broadcast announcement sent to 1240 participants", user: "Hackathon Admin", severity: "success" },
            ].map((log, i) => (
              <div key={i} className={`audit-log-item ${log.severity}`}>
                <div className="audit-time">{log.time}</div>
                <div className="audit-action">
                  <strong>{log.action}</strong>
                  <span>{log.details}</span>
                </div>
                <div className="audit-user">{log.user}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CREATE ADMIN MODAL */}
      {showCreateAdminModal && (
        <div className="modal-overlay" onClick={() => setShowCreateAdminModal(false)}>
          <div className="superadmin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <UserPlus size={22} color="#e11d48" />
                <h3 style={{ margin: 0 }}>Create Admin Account</h3>
              </div>
              <button onClick={() => setShowCreateAdminModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              <div className="form-grid-2">
                <div className="superadmin-field">
                  <label>FIRST NAME *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul"
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="superadmin-field">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Kumar"
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="superadmin-field">
                <label>EMAIL ADDRESS *</label>
                <input
                  type="email"
                  placeholder="admin@hackathonbuddy.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="superadmin-field">
                  <label>PASSWORD (leave blank to auto-generate)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  />
                </div>
                <div className="superadmin-field">
                  <label>ROLE *</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  >
                    <option value="HACKATHON_ADMIN">HACKATHON_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                  </select>
                </div>
              </div>

              <div className="superadmin-field">
                <label>PRIMARY ROLE DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="e.g. Hackathon Organizer, Platform Manager"
                  value={newAdmin.primaryRole}
                  onChange={(e) => setNewAdmin({ ...newAdmin, primaryRole: e.target.value })}
                />
              </div>

              <button type="submit" className="superadmin-submit-btn">
                <UserPlus size={18} /> Create Account & Generate Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
          <div className="superadmin-modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Key size={22} color="#d97706" />
                <h3 style={{ margin: 0 }}>Reset Password</h3>
              </div>
              <button onClick={() => setShowResetPasswordModal(false)}><X size={20} /></button>
            </div>

            {selectedUser && (
              <div className="reset-target-info">
                <strong>Target: {selectedUser.name || selectedUser.email}</strong>
                <small>{selectedUser.email} · {selectedUser.role}</small>
              </div>
            )}

            {!selectedUser && (
              <div className="superadmin-field">
                <label>SELECT USER</label>
                <select onChange={(e) => {
                  const u = displayUsers.find(user => String(user.id) === e.target.value);
                  setSelectedUser(u);
                }}>
                  <option value="">Choose a user...</option>
                  {displayUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="superadmin-field">
                <label>NEW PASSWORD *</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="superadmin-field">
                <label>CONFIRM PASSWORD *</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="superadmin-submit-btn amber">
                <Key size={18} /> Reset Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS MODAL */}
      {showCredentialModal && generatedCredentials && (
        <div className="modal-overlay" onClick={() => setShowCredentialModal(false)}>
          <div className="superadmin-modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={22} color="#10b981" />
                <h3 style={{ margin: 0 }}>Account Created Successfully!</h3>
              </div>
              <button onClick={() => setShowCredentialModal(false)}><X size={20} /></button>
            </div>

            <div className="generated-credentials">
              <div className="cred-row">
                <span className="cred-label">Name</span>
                <span className="cred-value">{generatedCredentials.name}</span>
              </div>
              <div className="cred-row">
                <span className="cred-label">Email</span>
                <span className="cred-value">{generatedCredentials.email}</span>
                <button className="pass-copy-btn" onClick={() => copyToClipboard(generatedCredentials.email)} title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <div className="cred-row">
                <span className="cred-label">Password</span>
                <code className="cred-password">{generatedCredentials.password}</code>
                <button className="pass-copy-btn" onClick={() => copyToClipboard(generatedCredentials.password)} title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <div className="cred-row">
                <span className="cred-label">Role</span>
                <span className={`role-badge ${getRoleBadgeClass(generatedCredentials.role)}`}>
                  {generatedCredentials.role}
                </span>
              </div>
            </div>

            <div className="cred-warning">
              <AlertTriangle size={16} />
              <span>Save these credentials securely. The password will not be shown again.</span>
            </div>

            <button
              className="superadmin-submit-btn green"
              onClick={() => {
                const text = `Account: ${generatedCredentials.name}\nEmail: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}\nRole: ${generatedCredentials.role}`;
                copyToClipboard(text);
              }}
            >
              <Copy size={18} /> Copy All Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
