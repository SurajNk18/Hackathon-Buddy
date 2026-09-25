import React, { useState } from "react";
import {
  Brain,
  Users,
  BarChart3,
  Lightbulb,
  Sparkles,
  Search,
  CheckCircle2,
  Target,
  Code2,
  Zap,
  ArrowRight,
  UserPlus
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./AIHub.css";

function AIHub() {
  const { currentUser, addTeamMember, addNotification, generatedIdeas, setGeneratedIdeas } = useApp();
  const [activeModule, setActiveModule] = useState("matching");

  /* TEAM MATCHING STATE */
  const [skills, setSkills] = useState(currentUser?.techSkills || "React, Python, Machine Learning");
  const [domain, setDomain] = useState("AI / ML");
  const [role, setRole] = useState("Full Stack Developer");
  const [matchingResults, setMatchingResults] = useState([]);

  /* SKILL GAP STATE */
  const [skillAnalysis, setSkillAnalysis] = useState(null);

  /* PROJECT IDEA STATE */
  const [ideaDomain, setIdeaDomain] = useState("AI / ML");
  const [technology, setTechnology] = useState("React + Python");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const candidatePool = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Backend Developer",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "REST API"],
      domain: "AI / ML",
      match: 94,
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "UI/UX Designer",
      skills: ["Figma", "UI/UX", "Prototyping", "Design Systems", "Tailwind"],
      domain: "Web",
      match: 87,
    },
    {
      id: 3,
      name: "Rohan Mehta",
      role: "ML Developer",
      skills: ["Python", "TensorFlow", "Machine Learning", "PyTorch", "NLP"],
      domain: "AI / ML",
      match: 96,
    },
    {
      id: 4,
      name: "Aman Khan",
      role: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
      domain: "Cloud",
      match: 91,
    }
  ];

  /* FIND TEAMMATES */
  const handleFindTeammates = () => {
    const querySkills = skills
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const results = candidatePool
      .map((cand) => {
        const matched = cand.skills.filter((cs) =>
          querySkills.some((qs) => cs.toLowerCase().includes(qs))
        );
        let score = cand.match;
        if (querySkills.length > 0) {
          score = Math.min(99, cand.match + matched.length * 3);
        }
        return {
          ...cand,
          calculatedMatch: score,
          matchedSkills: matched,
        };
      })
      .sort((a, b) => b.calculatedMatch - a.calculatedMatch);

    setMatchingResults(results);
  };

  /* SKILL GAP ANALYSIS */
  const handleSkillAnalysis = () => {
    const userSkillsArr = currentUser?.skills || ["React", "JavaScript", "Node.js", "PostgreSQL"];
    const targetStack = ["React", "Node.js", "Python", "Machine Learning", "PostgreSQL", "Docker", "AWS", "Figma"];

    const available = targetStack.filter((s) =>
      userSkillsArr.some((us) => us.toLowerCase() === s.toLowerCase())
    );
    const missing = targetStack.filter(
      (s) => !userSkillsArr.some((us) => us.toLowerCase() === s.toLowerCase())
    );
    const coverage = Math.round((available.length / targetStack.length) * 100);

    setSkillAnalysis({
      requiredSkills: targetStack,
      availableSkills: available,
      missingSkills: missing,
      coverage,
    });
  };

  /* PROJECT IDEA GENERATOR (In-Memory State, No LocalStorage) */
  const handleGenerateIdeas = () => {
    const ideas = [
      {
        title: "AI Hackathon Teammate Matcher & Squad Co-pilot",
        description:
          "Build an intelligent matching agent that scores candidate compatibility using vector similarity and generates sprint roadmaps.",
        tags: ["AI", "Matching", "React", "Python"],
        level: difficulty
      },
      {
        title: "Autonomous Sprint Task & Skill Gap Solver",
        description:
          "Analyze team repository commits, detect missing architectural skills, and generate AI-guided micro-learning exercises.",
        tags: ["ML", "Analytics", "FastAPI", "DevOps"],
        level: difficulty
      },
      {
        title: "Zero-Knowledge FinTech Micro-Lending Protocol",
        description:
          "A decentralized credit-scoring system that utilizes zero-knowledge proofs and ML risk models for instant collateral-free loans.",
        tags: ["Web3", "FinTech", "Smart Contracts", "AI"],
        level: difficulty
      },
      {
        title: "Smart Urban Mobility & EV Charging Mesh",
        description:
          "Real-time IoT telemetry and dynamic pricing routing system for autonomous EV fleet dispatch across metropolitan zones.",
        tags: ["IoT", "Smart City", "Real-Time", "React"],
        level: difficulty
      }
    ];

    setGeneratedIdeas(ideas);
    addNotification({
      type: "skill",
      icon: "💡",
      title: "Project Ideas Generated",
      message: `Generated 4 new ${ideaDomain} hackathon project blueprints.`,
      action: "View AI Hub",
      route: "/ai-hub"
    });
  };

  const handleConnect = (candidate) => {
    addTeamMember({
      id: Date.now(),
      name: candidate.name,
      role: candidate.role,
      skills: candidate.skills,
      letter: candidate.name.charAt(0)
    });
    alert(`Connected with ${candidate.name}! They have been added to your squad.`);
  };

  return (
    <div className="aihub-page">
      {/* HEADER */}
      <div className="aihub-header">
        <div>
          <div className="aihub-breadcrumb">HackathonBuddy / AI Hub</div>
          <h1>
            AI <span>INNOVATION HUB</span>
          </h1>
          <p>
            Intelligent tools to match teammates, audit squad capabilities, and architect winning hackathon solutions.
          </p>
        </div>

        <div className="aihub-header-icon">
          <Brain size={34} />
        </div>
      </div>

      {/* MODULE NAVIGATION CARDS */}
      <div className="aihub-module-grid">
        <button
          className={`aihub-module-card ${activeModule === "matching" ? "active" : ""}`}
          onClick={() => setActiveModule("matching")}
        >
          <div className="module-icon matching">
            <Users size={24} />
          </div>
          <div>
            <h3>AI Teammate Matching</h3>
            <p>Find teammates based on skill requirements, roles and domain compatibility.</p>
          </div>
        </button>

        <button
          className={`aihub-module-card ${activeModule === "skills" ? "active" : ""}`}
          onClick={() => {
            setActiveModule("skills");
            if (!skillAnalysis) handleSkillAnalysis();
          }}
        >
          <div className="module-icon skills">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3>Skill Gap Analysis</h3>
            <p>Discover missing technical capabilities in your project team.</p>
          </div>
        </button>

        <button
          className={`aihub-module-card ${activeModule === "ideas" ? "active" : ""}`}
          onClick={() => {
            setActiveModule("ideas");
            if (generatedIdeas.length === 0) handleGenerateIdeas();
          }}
        >
          <div className="module-icon ideas">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3>Project Idea Generator</h3>
            <p>Generate high-scoring hackathon project concepts tailored to your stack.</p>
          </div>
        </button>
      </div>

      {/* MODULE 1: AI TEAM MATCHING */}
      {activeModule === "matching" && (
        <section className="aihub-workspace">
          <div className="workspace-heading">
            <div>
              <span className="workspace-label">AI POWERED MATCHMAKER</span>
              <h2>Find Your Ideal Hackathon Teammates</h2>
              <p>Define what your team needs and our matching algorithm will rank candidate compatibility.</p>
            </div>
            <Sparkles className="heading-sparkle" />
          </div>

          <div className="matching-layout">
            <div className="aihub-form-card">
              <div className="form-group">
                <label>REQUIRED SKILLS</label>
                <input
                  type="text"
                  placeholder="React, Python, Machine Learning, Docker..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <small>Separate multiple skills with commas.</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PROJECT DOMAIN</label>
                  <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                    <option>AI / ML</option>
                    <option>Web Development</option>
                    <option>FinTech</option>
                    <option>HealthTech</option>
                    <option>Web3</option>
                    <option>All Domains</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>TARGET ROLE</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option>Full Stack Developer</option>
                    <option>Backend Developer</option>
                    <option>Frontend Developer</option>
                    <option>ML Developer</option>
                    <option>UI/UX Designer</option>
                    <option>Any Role</option>
                  </select>
                </div>
              </div>

              <button className="ai-primary-button" onClick={handleFindTeammates}>
                <Search size={18} />
                RUN AI MATCHING ENGINE
              </button>
            </div>

            <div className="ai-info-card">
              <Target size={28} />
              <h3>How AI Matching Works</h3>
              <p>
                Our engine combines vector skill similarity, role diversity indexing,
                and historical collaboration scores to suggest optimal squads.
              </p>
              <div className="matching-points">
                <span><CheckCircle2 size={16} /> Technical Skill Overlap</span>
                <span><CheckCircle2 size={16} /> Complementary Role Distribution</span>
                <span><CheckCircle2 size={16} /> Domain Track Synergy</span>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          {matchingResults.length > 0 && (
            <div className="results-section">
              <div className="results-heading">
                <h3>Recommended Candidates</h3>
                <span>{matchingResults.length} high-synergy matches</span>
              </div>

              <div className="teammate-grid">
                {matchingResults.map((member) => (
                  <div className="teammate-card" key={member.id}>
                    <div className="teammate-top">
                      <div className="avatar">{member.name.charAt(0)}</div>
                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                      <div className="match-score">
                        {member.calculatedMatch}%
                        <span>MATCH</span>
                      </div>
                    </div>

                    <div className="skill-tags">
                      {member.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <button className="connect-button" onClick={() => handleConnect(member)}>
                      <UserPlus size={16} />
                      ADD TO SQUAD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODULE 2: SKILL GAP ANALYSIS */}
      {activeModule === "skills" && (
        <section className="aihub-workspace">
          <div className="workspace-heading">
            <div>
              <span className="workspace-label">TEAM CAPABILITY AUDIT</span>
              <h2>Skill Gap & Balance Analysis</h2>
              <p>Audit your project stack against required production skills to prevent bottlenecks.</p>
            </div>
            <BarChart3 className="heading-sparkle" />
          </div>

          <div className="skill-analysis-card">
            <div className="analysis-top">
              <div>
                <h3>Production Readiness Coverage</h3>
                <p>Based on active developer profiles and project targets</p>
              </div>
              <div className="coverage-score">
                {skillAnalysis ? `${skillAnalysis.coverage}%` : "50%"}
              </div>
            </div>

            <div className="coverage-bar">
              <div style={{ width: `${skillAnalysis ? skillAnalysis.coverage : 50}%` }} />
            </div>

            <button
              className="ai-primary-button analysis-button"
              onClick={handleSkillAnalysis}
            >
              <BarChart3 size={18} />
              RE-CALCULATE SQUAD BALANCE
            </button>
          </div>

          {skillAnalysis && (
            <div className="analysis-result">
              <div className="analysis-column">
                <h3>✓ Available Covered Skills ({skillAnalysis.availableSkills.length})</h3>
                {skillAnalysis.availableSkills.map((skill) => (
                  <div className="analysis-skill available" key={skill}>
                    <CheckCircle2 size={16} />
                    {skill}
                  </div>
                ))}
              </div>

              <div className="analysis-column">
                <h3>⚡ Missing Capabilities to Recruit ({skillAnalysis.missingSkills.length})</h3>
                {skillAnalysis.missingSkills.map((skill) => (
                  <div className="analysis-skill missing" key={skill}>
                    <Zap size={16} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODULE 3: PROJECT IDEA GENERATOR */}
      {activeModule === "ideas" && (
        <section className="aihub-workspace">
          <div className="workspace-heading">
            <div>
              <span className="workspace-label">GENERATIVE AI BLUEPRINTS</span>
              <h2>Project Idea Generator</h2>
              <p>Generate innovative, prize-worthy hackathon ideas customized to your preferred technologies.</p>
            </div>
            <Lightbulb className="heading-sparkle" />
          </div>

          <div className="idea-generator-card">
            <div className="form-row">
              <div className="form-group">
                <label>DOMAIN</label>
                <select value={ideaDomain} onChange={(e) => setIdeaDomain(e.target.value)}>
                  <option>AI / ML</option>
                  <option>HealthTech</option>
                  <option>FinTech</option>
                  <option>EdTech</option>
                  <option>Web3</option>
                  <option>Smart City</option>
                </select>
              </div>

              <div className="form-group">
                <label>PRIMARY TECH STACK</label>
                <select value={technology} onChange={(e) => setTechnology(e.target.value)}>
                  <option>React + Python</option>
                  <option>React + Node.js</option>
                  <option>Java + Spring Boot</option>
                  <option>Python + FastAPI</option>
                  <option>MERN Stack</option>
                </select>
              </div>

              <div className="form-group">
                <label>DIFFICULTY LEVEL</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <button className="ai-primary-button" onClick={handleGenerateIdeas}>
              <Sparkles size={18} />
              GENERATE HACKATHON BLUEPRINTS
            </button>
          </div>

          {generatedIdeas.length > 0 && (
            <div className="ideas-grid">
              {generatedIdeas.map((idea, index) => (
                <div className="idea-card" key={index}>
                  <div className="idea-number">0{index + 1}</div>
                  <h3>{idea.title}</h3>
                  <p>{idea.description}</p>
                  <div className="skill-tags">
                    {idea.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* FOOTER BADGE */}
      <div className="aihub-footer">
        <Code2 size={16} />
        HackathonBuddy AI Engine v2.4 • In-Memory Fast State
      </div>
    </div>
  );
}

export default AIHub;