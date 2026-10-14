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
  MapPin,
  Calendar,
  UsersRound,
  Clock3,
  X,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Hackathon.css";

function Hackathon() {
  const navigate = useNavigate();
  const {
    hackathons,
    registeredHackathons,
    toggleHackathonRegistration,
    currentUser
  } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  const categories = [
    "All",
    "AI/ML",
    "Smart City",
    "FinTech",
    "Web3",
    "Environment",
    "Healthcare",
  ];

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((h) => {
      const matchesSearch =
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.category.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || h.category === category;

      const matchesStatus =
        status === "All" || h.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [hackathons, search, category, status]);

  const sidebarMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Hackathons", icon: Trophy, path: "/hackathons", active: true },
    { label: "Teams", icon: Users, path: "/teams" },
    { label: "AI Hub", icon: Brain, path: "/ai-hub" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="hackathon-page">
      {/* SIDEBAR */}
      <aside className="hackathon-sidebar">
        <div className="hackathon-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          <div className="brand-rocket">🚀</div>
          <div className="brand-name">
            HACKATHON<span>BUDDY</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`sidebar-item ${item.active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom-card">
          <div className="sidebar-bottom-icon">🏆</div>
          <h3>Ready to build<br />something amazing?</h3>
          <button onClick={() => navigate("/teams")}>
            Find Teammates →
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="hackathon-main">
        {/* TOP HEADER */}
        <header className="hackathon-header">
          <div className="header-title">
            <h1>Explore Hackathons</h1>
            <p>
              Discover high-impact opportunities, join elite competitions, and win prizes.
            </p>
          </div>

          <div className="header-right">
            <div className="header-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search hackathons, topics, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* HERO BANNER */}
        <section className="hackathon-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              FIND YOUR NEXT CHALLENGE
            </div>
            <h2>
              Build. Compete.
              <span> Create Impact.</span>
            </h2>
            <p>
              Match with challenges aligned with your tech stack ({currentUser?.techSkills || "React, Python, AI"}).
            </p>
          </div>
          <div className="hero-emoji">🏆</div>
        </section>

        {/* CONTROLS / FILTERS */}
        <section className="hackathon-controls">
          <div className="category-filter">
            <span className="filter-label">Categories</span>
            <div className="category-buttons">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category-button active"
                      : "category-button"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="status-filter">
            <SlidersHorizontal size={17} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open Now</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </section>

        {/* RESULTS HEADER */}
        <div className="results-header">
          <div>
            <h3>All Hackathons</h3>
            <span>{filteredHackathons.length} active opportunities found</span>
          </div>
        </div>

        {/* HACKATHON GRID */}
        <section className="hackathon-grid">
          {filteredHackathons.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No hackathons found</h3>
              <p>Try changing your search query or reset filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setStatus("All");
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredHackathons.map((hackathon) => {
              const isRegistered = registeredHackathons.includes(hackathon.id);
              return (
                <article className="hackathon-card" key={hackathon.id}>
                  {/* CARD TOP */}
                  <div className="card-top">
                    <div className={`hackathon-icon ${hackathon.color}`}>
                      {hackathon.icon}
                    </div>
                    <div className="card-match">
                      <span>{hackathon.match}%</span>
                      <small>Match</small>
                    </div>
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div className="card-title-area">
                    <div className="card-category">{hackathon.category}</div>
                    <h3>{hackathon.title}</h3>
                    <p>{hackathon.description}</p>
                  </div>

                  {/* INFO LIST */}
                  <div className="card-info">
                    <div>
                      <Calendar size={15} />
                      <span>{hackathon.date}</span>
                    </div>
                    <div>
                      <MapPin size={15} />
                      <span>{hackathon.location}</span>
                    </div>
                    <div>
                      <UsersRound size={15} />
                      <span>{hackathon.participants.toLocaleString()} hackers</span>
                    </div>
                    <div>
                      <Clock3 size={15} />
                      <span>{hackathon.duration}</span>
                    </div>
                  </div>

                  {/* PRIZE */}
                  <div className="card-prize">
                    <div>
                      <small>PRIZE POOL</small>
                      <strong>{hackathon.prize}</strong>
                    </div>
                    <div className="card-level">{hackathon.level}</div>
                  </div>

                  {/* ACTIONS */}
                  <div className="card-actions">
                    <button
                      className="details-button"
                      onClick={() => setSelectedHackathon(hackathon)}
                    >
                      View Details
                    </button>

                    <button
                      className={`register-button ${isRegistered ? "registered" : ""}`}
                      onClick={() => toggleHackathonRegistration(hackathon.id)}
                    >
                      {isRegistered ? "✓ Registered" : "Register"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {/* DETAILS MODAL */}
      {selectedHackathon && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedHackathon(null)}
        >
          <div
            className="hackathon-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedHackathon(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className={`modal-icon ${selectedHackathon.color}`}>
              {selectedHackathon.icon}
            </div>

            <div className="modal-category">
              {selectedHackathon.category}
            </div>

            <h2>{selectedHackathon.title}</h2>
            <p className="modal-description">
              {selectedHackathon.description}
            </p>

            <div className="modal-details">
              <div>
                <Calendar size={17} />
                <span>
                  <small>Event Date</small>
                  {selectedHackathon.date}
                </span>
              </div>
              <div>
                <Clock3 size={17} />
                <span>
                  <small>Duration</small>
                  {selectedHackathon.duration}
                </span>
              </div>
              <div>
                <MapPin size={17} />
                <span>
                  <small>Location</small>
                  {selectedHackathon.location}
                </span>
              </div>
              <div>
                <UsersRound size={17} />
                <span>
                  <small>Participants</small>
                  {selectedHackathon.participants.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="modal-prize">
              <span>Total Prize Pool</span>
              <strong>{selectedHackathon.prize}</strong>
            </div>

            <button
              className={`modal-register ${
                registeredHackathons.includes(selectedHackathon.id)
                  ? "registered"
                  : ""
              }`}
              onClick={() => {
                toggleHackathonRegistration(selectedHackathon.id);
              }}
            >
              {registeredHackathons.includes(selectedHackathon.id)
                ? "✓ You are Registered (Click to unregister)"
                : "Register for Hackathon"}
            </button>

            <button
              className="modal-external"
              onClick={() => {
                alert(`Redirecting to official portal for: ${selectedHackathon.title}`);
              }}
            >
              Visit Hackathon Website
              <ExternalLink size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hackathon;