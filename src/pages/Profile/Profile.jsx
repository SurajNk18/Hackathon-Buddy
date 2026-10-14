import React, { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Edit3,
  Save,
  X,
  Code2,
  Trophy,
  Users,
  FolderKanban,
  Calendar,
  CheckCircle2,
  Phone,
  Globe,
  Sparkles
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Profile.css";

function Profile() {
  const {
    currentUser,
    updateProfile,
    hackathons,
    registeredHackathons,
    teamMembers,
    projects,
    addNotification
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "Sanika Haridas Pandhare",
    firstName: currentUser?.firstName || "Sanika",
    lastName: currentUser?.lastName || "Pandhare",
    email: currentUser?.email || "sanika@example.com",
    phone: currentUser?.phone || "+91 98765 43210",
    role: currentUser?.primaryRole || currentUser?.role || "Full Stack Developer",
    location: currentUser?.location || "Pune, India",
    bio: currentUser?.bio || "Full Stack Developer passionate about building high-impact web apps, AI integrations, and winning hackathons.",
    githubUrl: currentUser?.githubUrl || "https://github.com/sanikapandhare",
    linkedinUrl: currentUser?.linkedinUrl || "https://linkedin.com/in/sanikapandhare",
    techSkills: currentUser?.techSkills || "React, Node.js, Spring Boot, JavaScript, PostgreSQL, Python",
    projectDomains: currentUser?.projectDomains || "AI / ML, Web Development, HealthTech, FinTech"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setFormData({
      fullName: currentUser?.fullName || "",
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      role: currentUser?.primaryRole || currentUser?.role || "",
      location: currentUser?.location || "",
      bio: currentUser?.bio || "",
      githubUrl: currentUser?.githubUrl || "",
      linkedinUrl: currentUser?.linkedinUrl || "",
      techSkills: currentUser?.techSkills || "",
      projectDomains: currentUser?.projectDomains || ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const skillsArr = formData.techSkills.split(",").map((s) => s.trim()).filter(Boolean);
    const domainsArr = formData.projectDomains.split(",").map((d) => d.trim()).filter(Boolean);

    updateProfile({
      ...formData,
      primaryRole: formData.role,
      skills: skillsArr,
      domains: domainsArr
    });

    addNotification({
      type: "system",
      icon: "⚙️",
      title: "Profile Updated",
      message: "Your profile, stack, and domain preferences were saved.",
      action: "View Profile",
      route: "/profile"
    });

    setIsEditing(false);
  };

  const skillsList = currentUser?.skills || formData.techSkills.split(",").map((s) => s.trim()).filter(Boolean);
  const domainsList = currentUser?.domains || formData.projectDomains.split(",").map((d) => d.trim()).filter(Boolean);

  const stats = [
    {
      icon: Trophy,
      value: `${registeredHackathons.length} / ${hackathons.length}`,
      label: "Hackathons",
      color: "purple",
    },
    {
      icon: Users,
      value: teamMembers.length.toString(),
      label: "Squad Members",
      color: "green",
    },
    {
      icon: FolderKanban,
      value: projects.length.toString(),
      label: "Projects",
      color: "orange",
    },
    {
      icon: Code2,
      value: "94%",
      label: "Profile Synergy",
      color: "blue",
    },
  ];

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-page-header">
        <div>
          <span className="profile-eyebrow">DEVELOPER IDENTITY & SETTINGS</span>
          <h1>My Profile</h1>
          <p>Manage your developer persona, stack credentials, and teammate matching preferences.</p>
        </div>

        {!isEditing ? (
          <button className="profile-edit-btn" onClick={handleEdit}>
            <Edit3 size={17} /> Edit Profile
          </button>
        ) : (
          <div className="profile-action-buttons">
            <button className="profile-cancel-btn" onClick={handleCancel}>
              <X size={17} /> Cancel
            </button>
            <button className="profile-save-btn" onClick={handleSave}>
              <Save size={17} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* HERO CARD */}
      <section className="profile-hero-card">
        <div className="profile-avatar">
          {currentUser?.firstName?.charAt(0) || currentUser?.fullName?.charAt(0) || "S"}
        </div>

        <div className="profile-hero-content">
          {!isEditing ? (
            <>
              <h2>{currentUser?.fullName}</h2>
              <div className="profile-role">
                {currentUser?.primaryRole || currentUser?.role || "Full Stack Developer"}
              </div>
              <div className="profile-meta">
                <span>
                  <Mail size={15} /> {currentUser?.email}
                </span>
                <span>
                  <MapPin size={15} /> {currentUser?.location || "India"}
                </span>
                <span>
                  <Phone size={15} /> {currentUser?.phone || "+91 98765 43210"}
                </span>
              </div>
            </>
          ) : (
            <div className="hero-edit-fields">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Primary Role"
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>
          )}
        </div>

        <div className="profile-completion">
          <div className="completion-header">
            <span>Profile Completeness</span>
            <strong>95%</strong>
          </div>
          <div className="completion-bar">
            <div style={{ width: "95%" }} />
          </div>
          <small>✓ Ready for AI squad matching</small>
        </div>
      </section>

      {/* STATS */}
      <section className="profile-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className={`profile-stat-card ${stat.color}`} key={stat.label}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* CONTENT GRID */}
      <div className="profile-content-grid">
        {/* LEFT COLUMN */}
        <div className="profile-main-column">
          {/* PERSONAL INFORMATION */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Personal Information</h3>
                <p>Basic developer contact credentials.</p>
              </div>
              <User size={20} />
            </div>

            {!isEditing ? (
              <div className="information-grid">
                <div className="information-item">
                  <span>Full Name</span>
                  <strong>{currentUser?.fullName}</strong>
                </div>
                <div className="information-item">
                  <span>Email Address</span>
                  <strong>{currentUser?.email}</strong>
                </div>
                <div className="information-item">
                  <span>Phone Number</span>
                  <strong>{currentUser?.phone || "+91 98765 43210"}</strong>
                </div>
                <div className="information-item">
                  <span>Location</span>
                  <strong>{currentUser?.location || "India"}</strong>
                </div>
              </div>
            ) : (
              <div className="edit-form-grid">
                <div className="form-field">
                  <label>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} />
                </div>
              </div>
            )}
          </section>

          {/* BIO / ABOUT */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Developer Bio</h3>
                <p>Summary displayed on your public teammate profile.</p>
              </div>
            </div>

            {isEditing ? (
              <textarea
                className="profile-bio-input"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              />
            ) : (
              <p className="profile-bio">{currentUser?.bio}</p>
            )}
          </section>

          {/* TECHNICAL SKILLS */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Technical Skills</h3>
                <p>Core programming languages, frameworks, and tools.</p>
              </div>
              <Code2 size={20} />
            </div>

            {isEditing ? (
              <div className="form-field">
                <label>Skills (comma-separated)</label>
                <input
                  name="techSkills"
                  value={formData.techSkills}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="skill-list">
                {skillsList.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            )}
          </section>

          {/* PROJECT DOMAINS */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Hackathon Domains</h3>
                <p>Target tracks and industry problem domains.</p>
              </div>
            </div>

            {isEditing ? (
              <div className="form-field">
                <label>Domains (comma-separated)</label>
                <input
                  name="projectDomains"
                  value={formData.projectDomains}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="domain-list">
                {domainsList.map((domain) => (
                  <span key={domain}>{domain}</span>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="profile-side-column">
          {/* SOCIAL LINKS */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Developer Links</h3>
                <p>Reputation profiles and portfolios.</p>
              </div>
            </div>

            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="form-field">
                  <label>GitHub URL</label>
                  <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>LinkedIn URL</label>
                  <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} />
                </div>
              </div>
            ) : (
              <div className="social-links">
                <a
                  href={currentUser?.githubUrl || "https://github.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <div className="social-logo github-logo">GH</div>
                  <div>
                    <strong>GitHub</strong>
                    <span>View repositories</span>
                  </div>
                </a>

                <a
                  href={currentUser?.linkedinUrl || "https://linkedin.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <div className="social-logo linkedin-logo">in</div>
                  <div>
                    <strong>LinkedIn</strong>
                    <span>View professional profile</span>
                  </div>
                </a>
              </div>
            )}
          </section>

          {/* ACTIVE TEAM CARD */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Active Squad</h3>
                <p>Current hackathon squad.</p>
              </div>
            </div>

            <div className="current-team">
              <div className="team-avatar">CC</div>
              <div>
                <strong>CodeCrafters</strong>
                <span>{teamMembers.length} team members</span>
              </div>
            </div>
          </section>

          {/* STATUS */}
          <section className="profile-section-card">
            <div className="section-title">
              <div>
                <h3>Matching Status</h3>
                <p>Teammate discovery settings.</p>
              </div>
            </div>

            <div className="profile-status-item">
              <CheckCircle2 size={18} color="#10b981" />
              <div>
                <strong>Visible to Teammate Search</strong>
                <span>Your profile is actively suggested in AI Hub.</span>
              </div>
            </div>

            <div className="profile-status-item">
              <Calendar size={18} color="#8b5cf6" />
              <div>
                <strong>Hackathon Season</strong>
                <span>Active 2026 Circuit</span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* MY PROJECTS SECTION */}
      <section className="profile-project-section">
        <div className="projects-header">
          <div>
            <span className="profile-eyebrow">WORKSPACE</span>
            <h2>My Projects ({projects.length})</h2>
            <p>Active codebases and repositories you are collaborating on.</p>
          </div>
        </div>

        <div className="profile-project-grid">
          {projects.map((proj) => (
            <div className="profile-project-card" key={proj.id}>
              <div className="project-top">
                <div className="project-icon">
                  <Code2 size={20} />
                </div>
                <span className="project-status">{proj.status}</span>
              </div>

              <h3>{proj.name}</h3>
              <p>{proj.domain}</p>

              <div className="project-progress-header">
                <span>Sprint Progress</span>
                <strong>{proj.progress || 60}%</strong>
              </div>

              <div className="project-progress">
                <div style={{ width: `${proj.progress || 60}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;