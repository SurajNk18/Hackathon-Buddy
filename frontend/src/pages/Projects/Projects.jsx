import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Bot,
  Users,
  CalendarDays,
  MoreVertical,
  X,
  Trash2,
  FolderKanban,
  CheckCircle2,
  Clock3,
  Circle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./Projects.css";

function Projects() {
  const {
    projects,
    createProject,
    deleteProject,
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    teamMembers
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    domain: "AI / ML",
    description: "",
    technologies: ""
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: teamMembers[0]?.name || "Sanika",
    priority: "High"
  });

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const techStr = Array.isArray(p.technologies) ? p.technologies.join(" ") : (p.technologies || "");
      const fullText = `${p.name} ${p.domain} ${p.description} ${techStr}`.toLowerCase();
      const matchesSearch = !q || fullText.includes(q);
      const matchesFilter = filter === "All" || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, filter]);

  // Tasks for selected project modal
  const projectTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject.id)
    : [];

  const completedCount = projectTasks.filter((t) => t.status === "Completed").length;
  const progressPercent = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : (selectedProject?.progress || 0);

  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const created = createProject({
      name: newProject.name,
      domain: newProject.domain,
      description: newProject.description,
      technologies: newProject.technologies
    });

    setNewProject({ name: "", domain: "AI / ML", description: "", technologies: "" });
    setShowCreateProject(false);
    setSelectedProject(created);
  };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !selectedProject) return;

    addTask({
      projectId: selectedProject.id,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority
    });

    setNewTask({
      title: "",
      description: "",
      assignedTo: teamMembers[0]?.name || "Sanika",
      priority: "Medium"
    });
    setShowAddTask(false);
  };

  return (
    <div className="projects-page">
      {/* PAGE HEADER */}
      <div className="projects-header">
        <div>
          <span className="page-eyebrow">WORKSPACE & SQUAD LAB</span>
          <h1>Projects</h1>
          <p>Manage hackathon deliverables, track sprint progress, and assign tasks across your team.</p>
        </div>

        <button
          className="create-project-button"
          onClick={() => setShowCreateProject(true)}
        >
          <Plus size={19} />
          CREATE NEW PROJECT
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="projects-toolbar">
        <div className="project-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search projects, domains, stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="project-filters">
          {["All", "Active", "Completed"].map((item) => (
            <button
              key={item}
              className={`filter-button ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="project-result-count">
        <strong>{filteredProjects.length}</strong> projects in workspace
      </div>

      {/* PROJECTS GRID */}
      {filteredProjects.length === 0 ? (
        <div className="no-projects">
          <FolderKanban size={48} color="#64748b" />
          <h3>No projects found</h3>
          <p>Create a new project workspace to start building your hackathon solution.</p>
          <button
            className="create-project-button"
            style={{ marginTop: "16px" }}
            onClick={() => setShowCreateProject(true)}
          >
            <Plus size={16} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const techs = Array.isArray(project.technologies)
              ? project.technologies
              : (project.technologies || "").split(",").map((t) => t.trim()).filter(Boolean);

            const projTasks = tasks.filter((t) => t.projectId === project.id);
            const compTasks = projTasks.filter((t) => t.status === "Completed").length;
            const computedProgress = projTasks.length > 0 ? Math.round((compTasks / projTasks.length) * 100) : (project.progress || 0);

            return (
              <div className="project-card" key={project.id}>
                {/* CARD TOP */}
                <div className="project-card-top">
                  <div className="project-icon">
                    <Bot size={26} />
                  </div>

                  <div className="project-menu-wrapper">
                    <button
                      className="project-menu-button"
                      onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === project.id && (
                      <div className="project-menu">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setOpenMenu(null);
                          }}
                        >
                          Open Workspace
                        </button>
                        <button
                          className="danger-menu"
                          onClick={() => {
                            deleteProject(project.id);
                            setOpenMenu(null);
                          }}
                        >
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* STATUS & DOMAIN */}
                <div className="project-status-row">
                  <span className={`project-status ${project.status === "Completed" ? "completed" : "active"}`}>
                    {project.status}
                  </span>
                  <span className="project-domain">{project.domain}</span>
                </div>

                <h2>{project.name}</h2>
                <p className="project-description">{project.description}</p>

                {/* TECHNOLOGIES */}
                <div className="project-technologies">
                  {techs.map((tech, idx) => (
                    <span key={`${tech}-${idx}`}>{tech}</span>
                  ))}
                </div>

                <div className="project-divider" />

                {/* META */}
                <div className="project-meta">
                  <div>
                    <Users size={16} />
                    <span>{project.members || 4} Members</span>
                  </div>
                  <div>
                    <CalendarDays size={16} />
                    <span>{project.createdAt}</span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="project-progress-container">
                  <div className="progress-label">
                    <span>Progress</span>
                    <strong>{computedProgress}%</strong>
                  </div>
                  <div className="project-progress-bar">
                    <div style={{ width: `${computedProgress}%` }} />
                  </div>
                </div>

                <button
                  className="open-project-btn"
                  onClick={() => setSelectedProject(project)}
                >
                  <span>Open Task Board</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateProject && (
        <div className="modal-overlay" onClick={() => setShowCreateProject(false)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Project Workspace</h3>
              <button onClick={() => setShowCreateProject(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit}>
              <div className="form-field">
                <label>PROJECT NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. AI Study Assistant"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>DOMAIN</label>
                <select
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                >
                  <option>AI / ML</option>
                  <option>Healthcare / AI</option>
                  <option>FinTech / Web3</option>
                  <option>EdTech</option>
                  <option>Smart City</option>
                  <option>Cyber Security</option>
                </select>
              </div>

              <div className="form-field">
                <label>DESCRIPTION</label>
                <textarea
                  rows="3"
                  placeholder="Describe your hackathon solution..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>TECH STACK (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python, PostgreSQL"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                />
              </div>

              <button type="submit" className="create-project-submit-btn">
                <Plus size={18} /> Initialize Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT WORKSPACE & TASK BOARD MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="task-board-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-board-header">
              <div>
                <span style={{ color: "#38bdf8", fontSize: "11px", fontWeight: "700" }}>PROJECT WORKSPACE</span>
                <h2>{selectedProject.name}</h2>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>
                  {selectedProject.domain} • Sprint Progress: {progressPercent}%
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  className="add-task-btn"
                  onClick={() => setShowAddTask(true)}
                >
                  <Plus size={16} /> Add Task
                </button>
                <button
                  className="close-modal-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", background: "#0a0e19" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                <span style={{ color: "#cbd5e1" }}>Task Completion ({completedCount}/{projectTasks.length})</span>
                <strong style={{ color: "#10b981" }}>{progressPercent}%</strong>
              </div>
              <div style={{ height: "8px", background: "#1e293b", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg, #7c3aed, #10b981)", transition: "width 0.3s" }} />
              </div>
            </div>

            {/* KANBAN / TASK LIST */}
            <div className="tasks-container">
              {projectTasks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  <CheckCircle2 size={36} style={{ marginBottom: "10px" }} />
                  <h4>No tasks added yet</h4>
                  <p style={{ fontSize: "13px" }}>Add tasks to coordinate deliverables with your teammates.</p>
                </div>
              ) : (
                <div className="tasks-grid-list">
                  {projectTasks.map((task) => (
                    <div className={`task-card-item ${task.status === "Completed" ? "done" : ""}`} key={task.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <strong style={{ color: "#f8fafc", fontSize: "14px" }}>{task.title}</strong>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
                          title="Delete task"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {task.description && (
                        <p style={{ color: "#94a3b8", fontSize: "12.5px", margin: "0 0 10px", lineHeight: "1.4" }}>
                          {task.description}
                        </p>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #1a2336" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ background: "#1e293b", color: "#94a3b8", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                            👤 {task.assignedTo}
                          </span>
                          <span style={{
                            background: task.priority === "High" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: task.priority === "High" ? "#f87171" : "#fbbf24",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600"
                          }}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Status Switcher */}
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          style={{
                            background: task.status === "Completed" ? "rgba(16, 185, 129, 0.2)" : "#131b2c",
                            border: "1px solid #27354f",
                            color: task.status === "Completed" ? "#34d399" : "#cbd5e1",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Sprint Task</h3>
              <button onClick={() => setShowAddTask(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit}>
              <div className="form-field">
                <label>TASK TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. Integrate Payment Gateway API"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>DESCRIPTION</label>
                <textarea
                  rows="2"
                  placeholder="Task details and expected output..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>ASSIGN TO</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>PRIORITY</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button type="submit" className="create-project-submit-btn">
                <Plus size={18} /> Add Task to Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;