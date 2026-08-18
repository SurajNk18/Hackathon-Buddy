import React, { useEffect, useMemo, useState } from "react";
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
  MapPin,
  Calendar,
  UsersRound,
  Clock3,
  ChevronDown,
  X,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUserLocal,
  getHackathons,
  getMyRegistrations,
  registerForHackathon,
  withdrawFromHackathon,
} from "../../api/api";

import "./Hackathon.css";

// ── Static mock data (fallback / seed) ──────────────────
const MOCK_HACKATHONS = [
  {
    id: 1,
    title: "AI Innovation Challenge 2026",
    category: "AI/ML",
    description:
      "Build innovative AI-powered solutions that solve real-world problems using machine learning and generative AI.",
    startDate: "18 Aug 2026",
    registrationDeadline: "15 Aug 2026",
    prizePool: "₹5,00,000",
    participants: 1240,
    location: "Online",
    duration: "48 Hours",
    matchScore: 92,
    isActive: true,
    level: "Intermediate",
    color: "purple",
    icon: "🤖",
  },
  {
    id: 2,
    title: "Smart City Hackathon",
    category: "Smart City",
    description:
      "Create technology solutions for smarter transportation, sustainable cities and better public services.",
    startDate: "25 Aug 2026",
    registrationDeadline: "22 Aug 2026",
    prizePool: "₹3,00,000",
    participants: 860,
    location: "Mumbai",
    duration: "36 Hours",
    matchScore: 86,
    isActive: true,
    level: "Intermediate",
    color: "blue",
    icon: "🏙️",
  },
  {
    id: 3,
    title: "FinTech Challenge",
    category: "FinTech",
    description:
      "Build the next generation of financial technology products with secure and scalable solutions.",
    startDate: "02 Sep 2026",
    registrationDeadline: "29 Aug 2026",
    prizePool: "₹4,00,000",
    participants: 720,
    location: "Bangalore",
    duration: "48 Hours",
    matchScore: 81,
    isActive: true,
    level: "Advanced",
    color: "orange",
    icon: "💳",
  },
  {
    id: 4,
    title: "Web3 Builders Arena",
    category: "Web3",
    description:
      "Build decentralized applications and explore the future of blockchain technology.",
    startDate: "10 Sep 2026",
    registrationDeadline: "06 Sep 2026",
    prizePool: "₹2,50,000",
    participants: 530,
    location: "Online",
    duration: "48 Hours",
    matchScore: 78,
    isActive: true,
    level: "Advanced",
    color: "cyan",
    icon: "⛓️",
  },
  {
    id: 5,
    title: "GreenTech Innovation Hack",
    category: "Environment",
    description:
      "Develop technology-driven solutions for climate change, renewable energy and sustainability.",
    startDate: "18 Sep 2026",
    registrationDeadline: "14 Sep 2026",
    prizePool: "₹2,00,000",
    participants: 430,
    location: "Pune",
    duration: "24 Hours",
    matchScore: 74,
    isActive: true,
    level: "Beginner",
    color: "green",
    icon: "🌱",
  },
  {
    id: 6,
    title: "Healthcare AI Sprint",
    category: "Healthcare",
    description:
      "Use AI and software technology to create better healthcare experiences and intelligent solutions.",
    startDate: "25 Sep 2026",
    registrationDeadline: "21 Sep 2026",
    prizePool: "₹3,50,000",
    participants: 650,
    location: "Online",
    duration: "48 Hours",
    matchScore: 88,
    isActive: true,
    level: "Intermediate",
    color: "pink",
    icon: "🏥",
  },
  {
    id: 7,
    title: "Campus Developer Challenge",
    category: "Development",
    description:
      "A developer-focused hackathon for students to build practical software products.",
    startDate: "05 Oct 2026",
    registrationDeadline: "01 Oct 2026",
    prizePool: "₹1,50,000",
    participants: 920,
    location: "Kolhapur",
    duration: "24 Hours",
    matchScore: 95,
    isActive: true,
    level: "Beginner",
    color: "purple",
    icon: "💻",
  },
  {
    id: 8,
    title: "Cyber Security Arena",
    category: "Cyber Security",
    description:
      "Solve security challenges and build innovative solutions for protecting digital systems.",
    startDate: "15 Oct 2026",
    registrationDeadline: "11 Oct 2026",
    prizePool: "₹4,50,000",
    participants: 480,
    location: "Hyderabad",
    duration: "48 Hours",
    matchScore: 72,
    isActive: true,
    level: "Advanced",
    color: "red",
    icon: "🔐",
  },
];

const CATEGORIES = [
  "All",
  "AI/ML",
  "Smart City",
  "FinTech",
  "Web3",
  "Environment",
  "Healthcare",
  "Development",
  "Cyber Security",
];

// Map backend category → color + icon for visual styling
function enrichHackathon(h) {
  const CAT_MAP = {
    "AI/ML":         { color: "purple", icon: "🤖" },
    "Smart City":    { color: "blue",   icon: "🏙️" },
    FinTech:         { color: "orange", icon: "💳" },
    Web3:            { color: "cyan",   icon: "⛓️" },
    Environment:     { color: "green",  icon: "🌱" },
    Healthcare:      { color: "pink",   icon: "🏥" },
    Development:     { color: "purple", icon: "💻" },
    "Cyber Security":{ color: "red",    icon: "🔐" },
  };
  const extra = CAT_MAP[h.category] || { color: "purple", icon: "🏆" };
  return {
    ...h,
    color:    h.color || extra.color,
    icon:     h.icon  || extra.icon,
    level:    h.level || "Intermediate",
    duration: h.duration || "48 Hours",
    participants: h.participants || 0,
    date:     h.startDate || h.date || "—",
  };
}

// ─────────────────────────────────────────────────────────

function Hackathon() {
  const navigate = useNavigate();

  // ── User ─────────────────────────────────────────────
  const currentUser = getCurrentUserLocal() || {};
  const userName    = currentUser.fullName || "Hackathon User";
  const firstLetter = userName.charAt(0).toUpperCase();
  const userRole    = currentUser.primaryRole || currentUser.role || "Full Stack";

  // ── State ─────────────────────────────────────────────
  const [search,             setSearch]             = useState("");
  const [category,           setCategory]           = useState("All");
  const [status,             setStatus]             = useState("All");
  const [selectedHackathon,  setSelectedHackathon]  = useState(null);

  const [hackathons,  setHackathons]  = useState([]);
  const [registered,  setRegistered]  = useState(new Set()); // IDs
  const [loading,     setLoading]     = useState(true);
  const [regLoading,  setRegLoading]  = useState(null); // hackathon id being registered

  // ── Load hackathons + my registrations ───────────────
  useEffect(() => {
    let alive = true;

    async function fetchData() {
      setLoading(true);
      const [hackRes, regRes] = await Promise.allSettled([
        getHackathons(),
        getMyRegistrations(),
      ]);

      if (!alive) return;

      // Hackathons
      if (hackRes.status === "fulfilled" && hackRes.value?.length > 0) {
        setHackathons(hackRes.value.map(enrichHackathon));
      } else {
        setHackathons(MOCK_HACKATHONS.map(enrichHackathon));
      }

      // Already-registered IDs
      if (regRes.status === "fulfilled" && regRes.value?.length > 0) {
        setRegistered(new Set(regRes.value.map((h) => h.id)));
      }

      setLoading(false);
    }

    fetchData();
    return () => { alive = false; };
  }, []);

  // ── Filter ────────────────────────────────────────────
  const filteredHackathons = useMemo(() => {
    return hackathons.filter((h) => {
      const matchesSearch =
        h.title?.toLowerCase().includes(search.toLowerCase()) ||
        h.category?.toLowerCase().includes(search.toLowerCase()) ||
        h.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || h.category === category;

      const matchesStatus =
        status === "All" ||
        (status === "Open"   &&  h.isActive) ||
        (status === "Closed" && !h.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status, hackathons]);

  // ── Register / Withdraw ───────────────────────────────
  const handleRegister = async (id) => {
    setRegLoading(id);
    try {
      if (registered.has(id)) {
        await withdrawFromHackathon(id);
        setRegistered((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await registerForHackathon(id);
        setRegistered((prev) => new Set([...prev, id]));
      }
    } catch (err) {
      // If not authenticated, redirect to login
      if (err.status === 401 || err.status === 403) {
        navigate("/login");
      } else {
        alert(err.message || "Could not complete registration. Please try again.");
      }
    } finally {
      setRegLoading(null);
    }
  };

  return (
    <div className="hackathon-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="hackathon-sidebar">

        <div className="hackathon-brand">
          <div className="brand-rocket">🚀</div>
          <div className="brand-name">
            HACKATHON<span>BUDDY</span>
          </div>
        </div>

        <nav className="sidebar-navigation">

          <button
            className="sidebar-item"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={21} />
            <span>Dashboard</span>
          </button>

          <button className="sidebar-item active">
            <Trophy size={21} />
            <span>Hackathons</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/teams")}
          >
            <Users size={21} />
            <span>Teams</span>
          </button>

          <button className="sidebar-item">
            <Brain size={21} />
            <span>AI Hub</span>
          </button>

          <button className="sidebar-item">
            <FolderKanban size={21} />
            <span>Projects</span>
          </button>

          <button className="sidebar-item">
            <MessageSquare size={21} />
            <span>Chat</span>
          </button>

          <button className="sidebar-item">
            <Bell size={21} />
            <span>Notifications</span>
          </button>

          <button className="sidebar-item">
            <User size={21} />
            <span>Profile</span>
          </button>

          <button className="sidebar-item">
            <ClipboardList size={21} />
            <span>My Registrations</span>
          </button>

          <button className="sidebar-item">
            <CalendarDays size={21} />
            <span>Calendar</span>
          </button>

          <button className="sidebar-item">
            <Settings size={21} />
            <span>Settings</span>
          </button>

        </nav>

        <div className="sidebar-bottom-card">
          <div className="sidebar-bottom-icon">🏆</div>

          <h3>Ready to build<br />something amazing?</h3>

          <button>Explore Hackathons</button>
        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="hackathon-main">

        {/* TOP HEADER */}

        <header className="hackathon-header">

          <div className="header-title">
            <h1>Hackathons</h1>
            <p>
              Discover opportunities and build something amazing.
            </p>
          </div>

          <div className="header-right">

            <div className="header-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Search hackathons, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="header-icon-button">
              <Bell size={21} />
              <span>5</span>
            </button>

            <div className="header-profile">

              <div className="profile-avatar">{firstLetter}</div>

              <div className="profile-info">
                <strong>{userName}</strong>
                <small>{userRole}</small>
              </div>

              <ChevronDown size={17} />

            </div>

          </div>

        </header>

        {/* HERO */}

        <section className="hackathon-hero">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={15} />
              FIND YOUR NEXT CHALLENGE
            </div>

            <h2>
              Build. Compete.
              <span> Create Impact.</span>
            </h2>

            <p>
              Find hackathons that match your skills, interests
              and career goals.
            </p>

          </div>

          <div className="hero-emoji">🏆</div>

        </section>

        {/* FILTER AREA */}

        <section className="hackathon-controls">

          <div className="category-filter">

            <span className="filter-label">Categories</span>

            <div className="category-buttons">

              {CATEGORIES.map((item) => (
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

            <SlidersHorizontal size={18} />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

          </div>

        </section>

        {/* RESULTS HEADER */}

        <div className="results-header">

          <div>
            <h3>All Hackathons</h3>

            <span>
              {loading ? "Loading…" : `${filteredHackathons.length} opportunities found`}
            </span>
          </div>

          <div className="sort-box">
            <span>Sort by</span>

            <select>
              <option>Best Match</option>
              <option>Newest</option>
              <option>Prize Pool</option>
              <option>Participants</option>
            </select>
          </div>

        </div>

        {/* HACKATHON GRID */}

        <section className="hackathon-grid">

          {loading ? (

            <div style={{
              gridColumn: "1/-1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "3rem",
              color: "#9ca3af",
            }}>
              <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
              Loading hackathons…
            </div>

          ) : filteredHackathons.length === 0 ? (

            <div className="no-results">

              <div className="no-results-icon">🔍</div>

              <h3>No hackathons found</h3>

              <p>Try changing your search or filters.</p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setStatus("All");
                }}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            filteredHackathons.map((hackathon) => (

              <article className="hackathon-card" key={hackathon.id}>

                {/* CARD TOP */}

                <div className="card-top">

                  <div className={`hackathon-icon ${hackathon.color}`}>
                    {hackathon.icon}
                  </div>

                  <div className="card-match">
                    <span>{hackathon.matchScore ?? "—"}%</span>
                    <small>Match</small>
                  </div>

                </div>

                {/* TITLE */}

                <div className="card-title-area">

                  <div className="card-category">{hackathon.category}</div>

                  <h3>{hackathon.title}</h3>

                  <p>{hackathon.description}</p>

                </div>

                {/* INFO */}

                <div className="card-info">

                  <div>
                    <Calendar size={16} />
                    <span>{hackathon.date}</span>
                  </div>

                  <div>
                    <MapPin size={16} />
                    <span>{hackathon.location}</span>
                  </div>

                  <div>
                    <UsersRound size={16} />
                    <span>{(hackathon.participants || 0).toLocaleString()} participants</span>
                  </div>

                  <div>
                    <Clock3 size={16} />
                    <span>{hackathon.duration}</span>
                  </div>

                </div>

                {/* PRIZE */}

                <div className="card-prize">

                  <div>
                    <small>PRIZE POOL</small>
                    <strong>{hackathon.prizePool || hackathon.prize || "—"}</strong>
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
                    className={
                      registered.has(hackathon.id)
                        ? "register-button registered"
                        : "register-button"
                    }
                    onClick={() => handleRegister(hackathon.id)}
                    disabled={regLoading === hackathon.id}
                  >
                    {regLoading === hackathon.id ? (
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    ) : registered.has(hackathon.id) ? (
                      "✓ Registered"
                    ) : (
                      "Register"
                    )}
                  </button>

                </div>

              </article>

            ))

          )}

        </section>

        {/* FOOTER */}

        <footer className="hackathon-footer">
          <p>© 2026 HackathonBuddy. Made for Hackers.</p>
        </footer>

      </main>


      {/* ================= DETAILS MODAL ================= */}

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
            >
              <X size={21} />
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
                <Calendar size={18} />
                <span>
                  <small>Event Date</small>
                  {selectedHackathon.date}
                </span>
              </div>

              <div>
                <Clock3 size={18} />
                <span>
                  <small>Duration</small>
                  {selectedHackathon.duration}
                </span>
              </div>

              <div>
                <MapPin size={18} />
                <span>
                  <small>Location</small>
                  {selectedHackathon.location}
                </span>
              </div>

              <div>
                <UsersRound size={18} />
                <span>
                  <small>Participants</small>
                  {(selectedHackathon.participants || 0).toLocaleString()}
                </span>
              </div>

            </div>

            <div className="modal-prize">
              <span>Prize Pool</span>
              <strong>{selectedHackathon.prizePool || selectedHackathon.prize || "—"}</strong>
            </div>

            <button
              className={
                registered.has(selectedHackathon.id)
                  ? "modal-register registered"
                  : "modal-register"
              }
              onClick={() => handleRegister(selectedHackathon.id)}
              disabled={regLoading === selectedHackathon.id}
            >
              {regLoading === selectedHackathon.id ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : registered.has(selectedHackathon.id) ? (
                "✓ You are Registered"
              ) : (
                "Register for Hackathon"
              )}
            </button>

            {selectedHackathon.websiteUrl && (
              <a
                className="modal-external"
                href={selectedHackathon.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Visit Hackathon Website
                <ExternalLink size={16} />
              </a>
            )}

            {!selectedHackathon.websiteUrl && (
              <button className="modal-external">
                Visit Hackathon Website
                <ExternalLink size={16} />
              </button>
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Hackathon;