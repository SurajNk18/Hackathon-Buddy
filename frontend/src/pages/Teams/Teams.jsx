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
  ClipboardList,
  CalendarDays,
  Settings,
  Search,
  ChevronDown,
  Plus,
  UserPlus,
  X,
  Check,
  UserCheck,
  Sparkles,
  Target,
  Code2,
  Palette,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Send,
  SlidersHorizontal,
} from "lucide-react";

import "./Teams.css";

function Teams() {
  const navigate = useNavigate();

  /* =====================================================
     CURRENT USER
     ===================================================== */

  const currentUser =
    JSON.parse(
      localStorage.getItem("hackathonBuddyCurrentUser")
    ) || {};

  const userName =
    currentUser.fullName ||
    currentUser.name ||
    "Hackathon User";

  const userRole =
    currentUser.primaryRole ||
    currentUser.role ||
    "Full Stack Developer";

  const userSkills = currentUser.techSkills
    ? currentUser.techSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [
        "React",
        "Java",
        "Spring Boot",
        "JavaScript",
      ];

  const firstLetter =
    userName.charAt(0).toUpperCase();


  /* =====================================================
     STATE
     ===================================================== */

  const [search, setSearch] = useState("");

  const [selectedRole, setSelectedRole] =
    useState("All Roles");

  const [selectedSkill, setSelectedSkill] =
    useState("All Skills");

  const [showCreateTeam, setShowCreateTeam] =
    useState(false);

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [teamName, setTeamName] =
    useState("");

  const [teamMembers, setTeamMembers] =
    useState([
      {
        id: 1,
        name: userName,
        role: userRole,
        skills: userSkills,
        letter: firstLetter,
        isYou: true,
      },
    ]);

  const [invitedMembers, setInvitedMembers] =
    useState([]);


  /* =====================================================
     DEMO USERS
     
     Later these should come from:
     GET /api/users/teammate-recommendations
     ===================================================== */

  const users = [
    {
      id: 2,
      name: "Priya Sharma",
      role: "UI/UX Designer",
      location: "Pune, India",
      skills: [
        "Figma",
        "UI/UX",
        "Prototyping",
        "Design Systems",
      ],
      interests: [
        "Healthcare",
        "EdTech",
        "AI",
      ],
      availability: "Available",
      experience: "Intermediate",
      match: 96,
      letter: "P",
      bio: "Product designer focused on clean and intuitive digital experiences.",
    },

    {
      id: 3,
      name: "Rohan Mehta",
      role: "ML Engineer",
      location: "Mumbai, India",
      skills: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "Pandas",
        "NLP",
      ],
      interests: [
        "AI",
        "Healthcare",
        "FinTech",
      ],
      availability: "Available",
      experience: "Advanced",
      match: 94,
      letter: "R",
      bio: "ML engineer building recommendation and prediction systems.",
    },

    {
      id: 4,
      name: "Aman Khan",
      role: "DevOps Engineer",
      location: "Bangalore, India",
      skills: [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Linux",
      ],
      interests: [
        "Cloud",
        "DevOps",
        "Cyber Security",
      ],
      availability: "Available",
      experience: "Advanced",
      match: 91,
      letter: "A",
      bio: "Cloud and DevOps engineer specializing in scalable deployments.",
    },

    {
      id: 5,
      name: "Neha Patil",
      role: "Backend Developer",
      location: "Kolhapur, India",
      skills: [
        "Node.js",
        "Express",
        "MongoDB",
        "REST API",
        "PostgreSQL",
      ],
      interests: [
        "SaaS",
        "FinTech",
        "EdTech",
      ],
      availability: "Available",
      experience: "Intermediate",
      match: 89,
      letter: "N",
      bio: "Backend developer interested in scalable API development.",
    },

    {
      id: 6,
      name: "Arjun Desai",
      role: "Data Scientist",
      location: "Hyderabad, India",
      skills: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "SQL",
        "Data Analysis",
      ],
      interests: [
        "AI",
        "Data",
        "Healthcare",
      ],
      availability: "Available",
      experience: "Intermediate",
      match: 87,
      letter: "A",
      bio: "Data scientist focused on turning datasets into useful insights.",
    },

    {
      id: 7,
      name: "Sneha Kulkarni",
      role: "Frontend Developer",
      location: "Pune, India",
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "JavaScript",
      ],
      interests: [
        "Web3",
        "SaaS",
        "EdTech",
      ],
      availability: "Available",
      experience: "Intermediate",
      match: 83,
      letter: "S",
      bio: "Frontend engineer who enjoys building responsive web applications.",
    },

    {
      id: 8,
      name: "Vikram Joshi",
      role: "Cyber Security Engineer",
      location: "Delhi, India",
      skills: [
        "Cyber Security",
        "Ethical Hacking",
        "Network Security",
        "Linux",
        "OWASP",
      ],
      interests: [
        "Security",
        "FinTech",
        "Cloud",
      ],
      availability: "Available",
      experience: "Advanced",
      match: 82,
      letter: "V",
      bio: "Security engineer focused on application and network security.",
    },

    {
      id: 9,
      name: "Kavya Rao",
      role: "Product Manager",
      location: "Chennai, India",
      skills: [
        "Product Strategy",
        "Research",
        "Communication",
        "Agile",
        "Documentation",
      ],
      interests: [
        "EdTech",
        "Healthcare",
        "SaaS",
      ],
      availability: "Available",
      experience: "Intermediate",
      match: 79,
      letter: "K",
      bio: "Product-focused builder who connects user problems with technical solutions.",
    },
  ];


  /* =====================================================
     ROLES
     ===================================================== */

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
    "Product Manager",
  ];


  /* =====================================================
     SKILLS
     ===================================================== */

  const skills = [
    "All Skills",
    "React",
    "Java",
    "Python",
    "Machine Learning",
    "Figma",
    "AWS",
    "Docker",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Cyber Security",
  ];


  /* =====================================================
     TEAM SKILLS
     ===================================================== */

  const teamSkills = [
    ...new Set(
      teamMembers.flatMap(
        (member) => member.skills
      )
    ),
  ];


  /* =====================================================
     MISSING SKILLS
     
     This is where your real ML recommendation
     can eventually be connected.
     ===================================================== */

  const requiredSkills = [
    "UI/UX",
    "Machine Learning",
    "AWS",
    "Docker",
  ];

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !teamSkills.some(
          (teamSkill) =>
            teamSkill.toLowerCase() ===
            skill.toLowerCase()
        )
    );


  /* =====================================================
     FILTER USERS
     ===================================================== */

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        user.name
          .toLowerCase()
          .includes(searchText) ||
        user.role
          .toLowerCase()
          .includes(searchText) ||
        user.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        );

      const matchesRole =
        selectedRole === "All Roles" ||
        user.role === selectedRole;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        user.skills.some(
          (skill) =>
            skill.toLowerCase() ===
            selectedSkill.toLowerCase()
        );

      const alreadyAdded =
        teamMembers.some(
          (member) => member.id === user.id
        );

      return (
        matchesSearch &&
        matchesRole &&
        matchesSkill &&
        !alreadyAdded
      );
    });

  }, [
    search,
    selectedRole,
    selectedSkill,
    teamMembers,
  ]);


  /* =====================================================
     ADD MEMBER
     ===================================================== */

  const handleAddMember = (member) => {

    const alreadyAdded =
      teamMembers.some(
        (item) => item.id === member.id
      );

    if (alreadyAdded) {
      return;
    }

    setTeamMembers((prev) => [
      ...prev,
      member,
    ]);

    setInvitedMembers((prev) => [
      ...prev,
      member.id,
    ]);

    setSelectedMember(null);

  };


  /* =====================================================
     REMOVE MEMBER
     ===================================================== */

  const handleRemoveMember = (memberId) => {

    setTeamMembers((prev) =>
      prev.filter(
        (member) => member.id !== memberId
      )
    );

  };


  /* =====================================================
     CREATE TEAM
     ===================================================== */

  const handleCreateTeam = (e) => {

    e.preventDefault();

    if (!teamName.trim()) {
      alert("Please enter a team name.");
      return;
    }

    const newTeam = {
      name: teamName.trim(),
      members: teamMembers,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "hackathonBuddyTeam",
      JSON.stringify(newTeam)
    );

    console.log(
      "========== TEAM CREATED =========="
    );

    console.log("Team Name:", teamName);
    console.log("Team Members:", teamMembers);

    console.log(
      "=================================="
    );

    alert(
      `Team "${teamName}" created successfully!`
    );

    setShowCreateTeam(false);

  };


  /* =====================================================
     NAVIGATION
     ===================================================== */

  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <div className="teams-page">


      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <aside className="teams-sidebar">

        <div className="teams-brand">

          <div className="teams-brand-icon">
            🚀
          </div>

          <div className="teams-brand-text">
            HACKATHON
            <span>BUDDY</span>
          </div>

        </div>


        <nav className="teams-sidebar-menu">

          <button
            onClick={() =>
              handleNavigation("/dashboard")
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>


          <button
            onClick={() =>
              handleNavigation("/hackathons")
            }
          >
            <Trophy size={20} />
            Hackathons
          </button>


          <button className="active">
            <Users size={20} />
            Teams
          </button>


          <button
            onClick={() =>
              handleNavigation("/ai-hub")
            }
          >
            <Brain size={20} />
            AI Hub
          </button>


          <button
            onClick={() =>
              handleNavigation("/projects")
            }
          >
            <FolderKanban size={20} />
            Projects
          </button>


          <button
            onClick={() =>
              handleNavigation("/chat")
            }
          >
            <MessageSquare size={20} />
            Chat
          </button>


          <button
            onClick={() =>
              handleNavigation("/notifications")
            }
          >
            <Bell size={20} />
            Notifications
          </button>


          <button
            onClick={() =>
              handleNavigation("/profile")
            }
          >
            <User size={20} />
            Profile
          </button>


          <button
            onClick={() =>
              handleNavigation("/registrations")
            }
          >
            <ClipboardList size={20} />
            My Registrations
          </button>


          <button
            onClick={() =>
              handleNavigation("/calendar")
            }
          >
            <CalendarDays size={20} />
            Calendar
          </button>


          <button
            onClick={() =>
              handleNavigation("/settings")
            }
          >
            <Settings size={20} />
            Settings
          </button>

        </nav>

      </aside>


      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="teams-main">


        {/* HEADER */}

        <header className="teams-header">

          <div>

            <h1>
              Find Your Team
            </h1>

            <p>
              Build your dream hackathon team
              with skill-based matching.
            </p>

          </div>


          <div className="teams-header-right">

            <button
              className="teams-header-icon"
              onClick={() =>
                handleNavigation(
                  "/notifications"
                )
              }
            >
              <Bell size={21} />
              <span>5</span>
            </button>


            <button
              className="teams-profile"
              onClick={() =>
                handleNavigation("/profile")
              }
            >

              <div className="teams-profile-avatar">
                {firstLetter}
              </div>

              <div>

                <strong>
                  {userName}
                </strong>

                <small>
                  {userRole}
                </small>

              </div>

              <ChevronDown size={17} />

            </button>

          </div>

        </header>


        {/* ==================================================
            HERO
            ================================================== */}

        <section className="teams-hero">

          <div className="teams-hero-content">

            <div className="teams-hero-badge">
              <Sparkles size={14} />
              AI-POWERED TEAM MATCHING
            </div>

            <h2>
              Find teammates who
              <span> complete your skills.</span>
            </h2>

            <p>
              We recommend people based on your
              skills, experience, interests and the
              skills your team is missing.
            </p>

          </div>


          <div className="teams-hero-graphic">

            <div className="hero-avatar one">
              P
            </div>

            <div className="hero-avatar two">
              R
            </div>

            <div className="hero-avatar three">
              A
            </div>

            <div className="hero-center-icon">
              🤝
            </div>

          </div>

        </section>


        {/* ==================================================
            MY TEAM
            ================================================== */}

        <section className="my-team-section">

          <div className="section-heading">

            <div>

              <h2>
                My Team
              </h2>

              <p>
                Manage your current team
                and identify missing skills.
              </p>

            </div>


            <button
              className="create-team-button"
              onClick={() =>
                setShowCreateTeam(true)
              }
            >

              <Plus size={18} />

              Create New Team

            </button>

          </div>


          <div className="my-team-card">


            {/* TEAM HEADER */}

            <div className="my-team-header">

              <div className="team-title-area">

                <div className="team-main-icon">
                  🚀
                </div>

                <div>

                  <h3>
                    {teamName ||
                      "Your Hackathon Team"}
                  </h3>

                  <p>
                    {teamMembers.length}
                    {" "}
                    member
                    {teamMembers.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>

              </div>


              <div className="team-status">
                <span></span>
                Open for Members
              </div>

            </div>


            {/* MEMBERS */}

            <div className="team-member-grid">

              {teamMembers.map(
                (member) => (

                  <div
                    className="current-member"
                    key={member.id}
                  >

                    <div className="current-member-avatar">
                      {member.letter}
                    </div>

                    <div className="current-member-info">

                      <strong>
                        {member.name}
                      </strong>

                      <span>
                        {member.role}
                      </span>

                      <div className="member-skills">

                        {member.skills
                          .slice(0, 3)
                          .map(
                            (skill) => (
                              <span
                                key={skill}
                              >
                                {skill}
                              </span>
                            )
                          )}

                      </div>

                    </div>


                    {member.isYou ? (

                      <span className="you-badge">
                        You
                      </span>

                    ) : (

                      <button
                        className="remove-member-button"
                        onClick={() =>
                          handleRemoveMember(
                            member.id
                          )
                        }
                      >
                        <X size={15} />
                      </button>

                    )}

                  </div>

                )
              )}


              {/* ADD MEMBER */}

              <button
                className="add-team-member"
                onClick={() =>
                  document
                    .getElementById(
                      "find-teammates"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >

                <div>
                  <UserPlus size={23} />
                </div>

                <strong>
                  Add Member
                </strong>

                <span>
                  Find someone
                </span>

              </button>

            </div>


            {/* TEAM SKILLS */}

            <div className="team-skills-section">

              <div className="team-skill-column">

                <div className="skill-column-title">

                  <Check
                    size={17}
                  />

                  <strong>
                    Skills Covered
                  </strong>

                </div>

                <div className="team-skill-list">

                  {teamSkills.map(
                    (skill) => (
                      <span
                        className="covered-skill"
                        key={skill}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>


              <div className="team-skill-column missing">

                <div className="skill-column-title">

                  <Target
                    size={17}
                  />

                  <strong>
                    Skills Needed
                  </strong>

                </div>

                <div className="team-skill-list">

                  {missingSkills.length > 0 ? (

                    missingSkills.map(
                      (skill) => (
                        <span
                          className="missing-skill"
                          key={skill}
                        >
                          + {skill}
                        </span>
                      )
                    )

                  ) : (

                    <span className="all-covered">
                      ✓ All key skills covered
                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            FIND TEAMMATES
            ================================================== */}

        <section
          className="find-team-section"
          id="find-teammates"
        >

          <div className="section-heading">

            <div>

              <h2>
                Recommended Teammates
              </h2>

              <p>
                People who can strengthen
                your team.
              </p>

            </div>

            <div className="recommendation-label">

              <Sparkles size={15} />

              AI Recommended

            </div>

          </div>


          {/* SEARCH + FILTERS */}

          <div className="team-filters">

            <div className="team-search">

              <Search size={19} />

              <input
                type="text"
                placeholder="Search by name, role or skill..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="team-select">

              <SlidersHorizontal
                size={17}
              />

              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(
                    e.target.value
                  )
                }
              >

                {roles.map(
                  (role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="team-select">

              <Code2 size={17} />

              <select
                value={selectedSkill}
                onChange={(e) =>
                  setSelectedSkill(
                    e.target.value
                  )
                }
              >

                {skills.map(
                  (skill) => (
                    <option
                      key={skill}
                      value={skill}
                    >
                      {skill}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>


          {/* USERS */}

          <div className="recommended-grid">

            {filteredUsers.length === 0 ? (

              <div className="no-members">

                <Users size={35} />

                <h3>
                  No teammates found
                </h3>

                <p>
                  Try another role,
                  skill or search.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedRole(
                      "All Roles"
                    );
                    setSelectedSkill(
                      "All Skills"
                    );
                  }}
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              filteredUsers.map(
                (member) => (

                  <article
                    className="teammate-card"
                    key={member.id}
                  >

                    {/* MATCH */}

                    <div className="match-badge">

                      <Sparkles size={12} />

                      {member.match}%
                      Match

                    </div>


                    {/* PROFILE */}

                    <div className="teammate-profile">

                      <div className="teammate-avatar">
                        {member.letter}
                      </div>

                      <div>

                        <h3>
                          {member.name}
                        </h3>

                        <p>
                          {member.role}
                        </p>

                      </div>

                    </div>


                    {/* LOCATION */}

                    <div className="teammate-location">

                      📍 {member.location}

                    </div>


                    {/* BIO */}

                    <p className="teammate-bio">
                      {member.bio}
                    </p>


                    {/* SKILLS */}

                    <div className="teammate-skills">

                      {member.skills
                        .slice(0, 5)
                        .map(
                          (skill) => (
                            <span
                              key={skill}
                            >
                              {skill}
                            </span>
                          )
                        )}

                    </div>


                    {/* INTERESTS */}

                    <div className="interest-row">

                      <strong>
                        Interests
                      </strong>

                      <div>

                        {member.interests
                          .slice(0, 2)
                          .map(
                            (interest) => (
                              <span
                                key={interest}
                              >
                                {interest}
                              </span>
                            )
                          )}

                      </div>

                    </div>


                    {/* FOOTER */}

                    <div className="teammate-footer">

                      <div className="availability">

                        <span></span>

                        {member.availability}

                      </div>


                      <div className="teammate-actions">

                        <button
                          className="view-profile-button"
                          onClick={() =>
                            setSelectedMember(
                              member
                            )
                          }
                        >
                          View Profile
                        </button>

                        <button
                          className="invite-button"
                          onClick={() =>
                            handleAddMember(
                              member
                            )
                          }
                        >

                          <UserPlus
                            size={16}
                          />

                          Invite

                        </button>

                      </div>

                    </div>

                  </article>

                )
              )

            )}

          </div>

        </section>


        {/* ==================================================
            WHY MATCHING
            ================================================== */}

        <section className="matching-explanation">

          <div className="matching-icon">
            <Brain size={27} />
          </div>

          <div>

            <h3>
              How HackathonBuddy Matching Works
            </h3>

            <p>
              Recommendations consider your
              team's missing skills, technical
              expertise, interests and experience.
              The goal isn't to find someone
              identical to you — it's to find
              someone who makes your team stronger.
            </p>

          </div>

        </section>


      </main>


      {/* ==================================================
          PROFILE MODAL
          ================================================== */}

      {selectedMember && (

        <div
          className="teams-modal-overlay"
          onClick={() =>
            setSelectedMember(null)
          }
        >

          <div
            className="member-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close-button"
              onClick={() =>
                setSelectedMember(null)
              }
            >
              <X size={20} />
            </button>


            <div className="modal-profile">

              <div className="modal-avatar">
                {selectedMember.letter}
              </div>

              <div>

                <h2>
                  {selectedMember.name}
                </h2>

                <p>
                  {selectedMember.role}
                </p>

                <span>
                  {selectedMember.location}
                </span>

              </div>

            </div>


            <div className="modal-match">

              <Sparkles size={17} />

              <strong>
                {selectedMember.match}%
              </strong>

              <span>
                Skill Match
              </span>

            </div>


            <div className="modal-section">

              <h4>
                About
              </h4>

              <p>
                {selectedMember.bio}
              </p>

            </div>


            <div className="modal-section">

              <h4>
                Skills
              </h4>

              <div className="modal-skills">

                {selectedMember.skills.map(
                  (skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>


            <div className="modal-section">

              <h4>
                Interests
              </h4>

              <div className="modal-skills">

                {selectedMember.interests.map(
                  (interest) => (
                    <span key={interest}>
                      {interest}
                    </span>
                  )
                )}

              </div>

            </div>


            <div className="modal-actions">

              <button
                className="modal-message-button"
                onClick={() =>
                  handleNavigation("/chat")
                }
              >

                <MessageSquare
                  size={17}
                />

                Message

              </button>


              <button
                className="modal-invite-button"
                onClick={() =>
                  handleAddMember(
                    selectedMember
                  )
                }
              >

                <UserPlus size={17} />

                Invite to Team

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          CREATE TEAM MODAL
          ================================================== */}

      {showCreateTeam && (

        <div
          className="teams-modal-overlay"
          onClick={() =>
            setShowCreateTeam(false)
          }
        >

          <div
            className="create-team-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close-button"
              onClick={() =>
                setShowCreateTeam(false)
              }
            >
              <X size={20} />
            </button>


            <div className="create-team-icon">
              🚀
            </div>

            <h2>
              Create Your Team
            </h2>

            <p>
              Give your team a name and
              start inviting teammates.
            </p>


            <form
              onSubmit={
                handleCreateTeam
              }
            >

              <label>
                Team Name
              </label>

              <input
                type="text"
                placeholder="e.g. CodeCrafters"
                value={teamName}
                onChange={(e) =>
                  setTeamName(
                    e.target.value
                  )
                }
                autoFocus
              />


              <div className="create-team-preview">

                <div className="preview-title">
                  Current Members
                </div>

                <div className="preview-members">

                  {teamMembers.map(
                    (member) => (

                      <div
                        className="preview-member"
                        key={member.id}
                      >

                        <span>
                          {member.letter}
                        </span>

                        <small>
                          {member.name}
                        </small>

                      </div>

                    )
                  )}

                </div>

              </div>


              <button
                type="submit"
                className="create-team-submit"
              >

                <Plus size={18} />

                Create Team

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Teams;