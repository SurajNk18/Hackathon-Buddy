import React, { useMemo, useState } from "react";
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
  UserPlus,
  X,
  Check,
  Sparkles,
  SlidersHorizontal,
  Mail,
  Trash2,
  CheckCircle2,
  MapPin,
  Code2
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Teams.css";

function Teams() {
  const navigate = useNavigate();
  const {
    currentUser,
    teamMembers,
    addTeamMember,
    removeTeamMember,
    addNotification
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [teamName, setTeamName] = useState("CodeCrafters");

  const userName = currentUser?.fullName || "Developer";
  const userRole = currentUser?.primaryRole || currentUser?.role || "Full Stack Developer";

  // Candidate pool for AI teammate recommendations
  const candidates = [
    {
      id: 10,
      name: "Priya Sharma",
      role: "UI/UX Designer",
      location: "Pune, India",
      skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
      interests: ["Healthcare", "EdTech", "AI"],
      match: 96,
      letter: "P",
      bio: "Product designer passionate about accessible and intuitive design systems."
    },
    {
      id: 11,
      name: "Rohan Mehta",
      role: "ML Engineer",
      location: "Mumbai, India",
      skills: ["Python", "TensorFlow", "Pandas", "NLP", "PyTorch"],
      interests: ["AI", "Healthcare", "FinTech"],
      match: 94,
      letter: "R",
      bio: "ML engineer with focus on large language models and prediction pipelines."
    },
    {
      id: 12,
      name: "Aman Khan",
      role: "DevOps Engineer",
      location: "Bangalore, India",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
      interests: ["Cloud", "DevOps", "Cyber Security"],
      match: 91,
      letter: "A",
      bio: "Cloud specialist ensuring smooth CI/CD pipelines, containerization, and autoscaling."
    },
    {
      id: 13,
      name: "Neha Patil",
      role: "Backend Developer",
      location: "Kolhapur, India",
      skills: ["Node.js", "Express", "MongoDB", "REST API", "PostgreSQL"],
      interests: ["SaaS", "FinTech", "EdTech"],
      match: 89,
      letter: "N",
      bio: "Backend developer specializing in high-throughput APIs and distributed databases."
    },
    {
      id: 14,
      name: "Arjun Desai",
      role: "Data Scientist",
      location: "Hyderabad, India",
      skills: ["Python", "Pandas", "Scikit-learn", "SQL", "Data Analysis"],
      interests: ["AI", "Data", "Healthcare"],
      match: 87,
      letter: "A",
      bio: "Data scientist experienced in cleaning, aggregating, and extracting business insights."
    },
    {
      id: 15,
      name: "Sneha Kulkarni",
      role: "Frontend Developer",
      location: "Pune, India",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
      interests: ["Web3", "SaaS", "EdTech"],
      match: 85,
      letter: "S",
      bio: "Frontend engineer who creates responsive, accessible, and fast web UIs."
    },
    {
      id: 16,
      name: "Vikram Joshi",
      role: "Cyber Security Engineer",
      location: "Delhi, India",
      skills: ["Cyber Security", "Ethical Hacking", "OWASP", "Linux"],
      interests: ["Security", "FinTech", "Cloud"],
      match: 82,
      letter: "V",
      bio: "Penetration tester and security architect securing web applications."
    }
  ];

  const roles = [
    "All Roles",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "ML Engineer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Cyber Security Engineer",
  ];

  const skills = [
    "All Skills",
    "React",
    "Python",
    "Figma",
    "AWS",
    "Docker",
    "Node.js",
    "PostgreSQL",
    "Kubernetes",
  ];

  const sidebarMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Hackathons", icon: Trophy, path: "/hackathons" },
    { label: "Teams", icon: Users, path: "/teams", active: true },
    { label: "AI Hub", icon: Brain, path: "/ai-hub" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  // Team skills
  const teamSkills = Array.from(
    new Set(teamMembers.flatMap((m) => m.skills || []))
  );

  const requiredSkills = ["UI/UX", "Machine Learning", "AWS", "Docker", "React", "Node.js"];
  const missingSkills = requiredSkills.filter(
    (req) => !teamSkills.some((ts) => ts.toLowerCase() === req.toLowerCase())
  );

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        candidate.name.toLowerCase().includes(q) ||
        candidate.role.toLowerCase().includes(q) ||
        candidate.skills.some((s) => s.toLowerCase().includes(q));

      const matchesRole =
        selectedRole === "All Roles" || candidate.role === selectedRole;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        candidate.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      const isAlreadyMember = teamMembers.some((m) => m.name === candidate.name);

      return matchesSearch && matchesRole && matchesSkill && !isAlreadyMember;
    });
  }, [candidates, search, selectedRole, selectedSkill, teamMembers]);

  const handleInviteCandidate = (candidate) => {
    addTeamMember({
      id: Date.now(),
      name: candidate.name,
      role: candidate.role,
      skills: candidate.skills,
      letter: candidate.letter
    });
    setSelectedCandidate(null);
  };

  const handleSaveTeamName = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    addNotification({
      type: "team",
      icon: "👥",
      title: "Team Updated",
      message: `Team renamed to "${teamName.trim()}".`,
      action: "View Team",
      route: "/teams"
    });
    setShowCreateTeam(false);
  };

  return (
    <div className="teams-page">
      {/* SIDEBAR */}
      <aside className="teams-sidebar">
        <div
          className="teams-brand"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <div className="teams-brand-icon">🚀</div>
          <div className="teams-brand-text">
            HACKATHON<span>BUDDY</span>
          </div>
        </div>

        <nav className="teams-sidebar-menu">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={item.active ? "active" : ""}
                onClick={() => navigate(item.path)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="teams-main">
        {/* HEADER */}
        <header className="teams-header">
          <div>
            <h1>Find Your Dream Team</h1>
            <p>
              Build your winning hackathon squad with AI skill-based matching and gap analysis.
            </p>
          </div>

          <div className="teams-header-right">
            <button
              className="create-team-btn"
              onClick={() => setShowCreateTeam(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 16px",
                background: "#7c3aed",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <Plus size={16} />
              Rename Team
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="teams-hero">
          <div className="teams-hero-content">
            <div className="teams-hero-badge">
              <Sparkles size={14} />
              AI-POWERED SQUAD BUILDER
            </div>
            <h2>
              Find teammates who
              <span> complete your skills.</span>
            </h2>
            <p>
              We calculate compatibility based on role balance, missing technical skills,
              and project domain alignment.
            </p>
          </div>

          <div className="teams-hero-graphic">
            <div className="hero-avatar one">P</div>
            <div className="hero-avatar two">R</div>
            <div className="hero-avatar three">A</div>
            <div className="hero-center-icon">🤝</div>
          </div>
        </section>

        {/* ACTIVE TEAM SECTION */}
        <section className="active-team-card" style={{
          background: "linear-gradient(145deg, #111726, #0e1320)",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <span style={{ color: "#a78bfa", fontSize: "11px", fontWeight: "800", letterSpacing: "1px" }}>CURRENT SQUAD</span>
              <h2 style={{ color: "#f8fafc", fontSize: "20px", margin: "4px 0 0" }}>
                {teamName} ({teamMembers.length} Members)
              </h2>
            </div>
            <button
              onClick={() => navigate("/chat")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid #8b5cf6",
                color: "#c4b5fd",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <MessageSquare size={16} />
              Team Chat
            </button>
          </div>

          {/* Members list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  background: "#0a0e1a",
                  border: "1px solid #1f293d",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: member.isYou ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e293b",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700"
                  }}>
                    {member.letter || member.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "14px", display: "block" }}>
                      {member.name} {member.isYou && <small style={{ color: "#a78bfa" }}>(You)</small>}
                    </strong>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>{member.role}</span>
                  </div>
                </div>

                {!member.isYou && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    title="Remove from team"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "6px"
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Skill Gap Banner */}
          <div style={{
            marginTop: "20px",
            padding: "16px",
            background: "rgba(124, 58, 237, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <strong style={{ color: "#e2e8f0", fontSize: "13.5px" }}>Skills Covered:</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                {teamSkills.slice(0, 8).map((sk) => (
                  <span key={sk} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {missingSkills.length > 0 && (
              <div>
                <strong style={{ color: "#fbbf24", fontSize: "13.5px" }}>Missing Skills Needed:</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {missingSkills.map((sk) => (
                    <span key={sk} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SEARCH & FILTERS FOR TEAMMATES */}
        <section className="teams-filter-bar" style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "24px"
        }}>
          <div style={{
            flex: 1,
            minWidth: "260px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#111726",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "0 14px",
            height: "44px"
          }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search hackers by name, role, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f8fafc",
                fontSize: "13.5px"
              }}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              height: "44px",
              background: "#111726",
              border: "1px solid #1e293b",
              borderRadius: "10px",
              color: "#f8fafc",
              padding: "0 14px",
              fontSize: "13px"
            }}
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              height: "44px",
              background: "#111726",
              border: "1px solid #1e293b",
              borderRadius: "10px",
              color: "#f8fafc",
              padding: "0 14px",
              fontSize: "13px"
            }}
          >
            {skills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </section>

        {/* CANDIDATES GRID */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredCandidates.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "48px 20px",
              background: "#0c101c",
              borderRadius: "16px",
              border: "1px dashed #1e293b"
            }}>
              <Users size={40} color="#64748b" style={{ marginBottom: "12px" }} />
              <h3 style={{ color: "#f8fafc" }}>No candidates found</h3>
              <p style={{ color: "#64748b", fontSize: "13px" }}>Try broadening your search or role filters.</p>
            </div>
          ) : (
            filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                style={{
                  background: "linear-gradient(145deg, #111726, #0d121e)",
                  border: "1px solid #1e293b",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, border-color 0.2s"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "16px"
                      }}>
                        {cand.letter}
                      </div>
                      <div>
                        <strong style={{ color: "#f8fafc", fontSize: "15px", display: "block" }}>{cand.name}</strong>
                        <span style={{ color: "#38bdf8", fontSize: "12.5px" }}>{cand.role}</span>
                      </div>
                    </div>

                    <div style={{
                      padding: "4px 8px",
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "6px",
                      color: "#34d399",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}>
                      {cand.match}% MATCH
                    </div>
                  </div>

                  <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", margin: "0 0 14px" }}>
                    {cand.bio}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "12px", marginBottom: "12px" }}>
                    <MapPin size={14} />
                    <span>{cand.location}</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {cand.skills.map((sk) => (
                      <span key={sk} style={{
                        background: "#182236",
                        border: "1px solid #27354d",
                        color: "#cbd5e1",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px"
                      }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleInviteCandidate(cand)}
                    style={{
                      flex: 1,
                      padding: "9px 14px",
                      background: "#7c3aed",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <UserPlus size={16} />
                    Add to Squad
                  </button>
                  <button
                    onClick={() => navigate("/chat")}
                    style={{
                      padding: "9px 12px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                      color: "#94a3b8",
                      cursor: "pointer"
                    }}
                    title="Message candidate"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* RENAME / CREATE TEAM MODAL */}
      {showCreateTeam && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateTeam(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111726",
              border: "1px solid #26334a",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ color: "#f8fafc", margin: 0, fontSize: "18px" }}>Edit Team Name</h3>
              <button
                onClick={() => setShowCreateTeam(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTeamName}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>
                  TEAM / SQUAD NAME
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. NeuralCoders, CodeCrafters"
                  required
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "#090d16",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    padding: "0 12px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  height: "44px",
                  background: "#7c3aed",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Save Team Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;