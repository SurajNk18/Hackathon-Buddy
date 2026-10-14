import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const initialUser = {
  id: "usr-1",
  fullName: "Sanika Haridas Pandhare",
  firstName: "Sanika",
  lastName: "Haridas Pandhare",
  email: "sanika@example.com",
  phone: "+91 98765 43210",
  password: "password123",
  primaryRole: "Full Stack Developer",
  role: "Full Stack Developer",
  location: "Pune, India",
  bio: "Full Stack Developer passionate about building high-impact web apps, AI integrations, and winning hackathons.",
  techSkills: "React, Node.js, Spring Boot, JavaScript, PostgreSQL, Python",
  projectDomains: "AI / ML, Web Development, HealthTech, FinTech",
  githubUrl: "https://github.com/sanikapandhare",
  linkedinUrl: "https://linkedin.com/in/sanikapandhare",
  skills: ["React", "JavaScript", "Node.js", "Spring Boot", "PostgreSQL", "Python"],
  domains: ["AI / ML", "Web Development", "HealthTech", "FinTech"],
  isAdmin: true
};
export const initialAdmin = {
  id: "admin-1",
  fullName: "System Administrator",
  firstName: "Admin",
  lastName: "User",
  email: "admin@hackathonbuddy.com",
  phone: "+91 98765 00000",
  password: "admin123",
  primaryRole: "Platform Administrator",
  role: "Platform Administrator",
  location: "HQ Command Center",
  bio: "Platform Administrator with full permissions over hackathon challenges, user moderation, and AI telemetry.",
  techSkills: "System Architecture, Security, Cloud DevOps, AI Orchestration",
  projectDomains: "Platform Operations, Hackathon Moderation",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  skills: ["Security", "Cloud DevOps", "AI Orchestration"],
  domains: ["Platform Operations"],
  isAdmin: true
};

export const initialHackathons = [
  {
    id: 1,
    title: "AI Innovation Challenge 2026",
    category: "AI/ML",
    description: "Build innovative AI-powered solutions that solve real-world problems using machine learning and generative AI.",
    date: "18 Aug 2026",
    deadline: "15 Aug 2026",
    prize: "₹5,00,000",
    participants: 1240,
    location: "Online",
    duration: "48 Hours",
    match: 94,
    status: "Open",
    level: "Intermediate",
    color: "purple",
    icon: "🤖",
    type: "ai"
  },
  {
    id: 2,
    title: "Smart City Hackathon",
    category: "Smart City",
    description: "Create technology solutions for smarter transportation, sustainable cities and better public services.",
    date: "25 Aug 2026",
    deadline: "22 Aug 2026",
    prize: "₹3,00,000",
    participants: 860,
    location: "Mumbai",
    duration: "36 Hours",
    match: 86,
    status: "Open",
    level: "Intermediate",
    color: "blue",
    icon: "🏙️",
    type: "city"
  },
  {
    id: 3,
    title: "FinTech Challenge",
    category: "FinTech",
    description: "Build the next generation of financial technology products with secure and scalable solutions.",
    date: "02 Sep 2026",
    deadline: "29 Aug 2026",
    prize: "₹4,00,000",
    participants: 720,
    location: "Bangalore",
    duration: "48 Hours",
    match: 81,
    status: "Open",
    level: "Advanced",
    color: "orange",
    icon: "💳",
    type: "fintech"
  },
  {
    id: 4,
    title: "Web3 Builders Arena",
    category: "Web3",
    description: "Build decentralized applications and explore the future of blockchain technology.",
    date: "10 Sep 2026",
    deadline: "06 Sep 2026",
    prize: "₹2,50,000",
    participants: 530,
    location: "Online",
    duration: "48 Hours",
    match: 78,
    status: "Open",
    level: "Advanced",
    color: "cyan",
    icon: "⛓️",
    type: "web3"
  },
  {
    id: 5,
    title: "GreenTech Innovation Hack",
    category: "Environment",
    description: "Develop technology-driven solutions for climate change, renewable energy and sustainability.",
    date: "18 Sep 2026",
    deadline: "14 Sep 2026",
    prize: "₹2,00,000",
    participants: 430,
    location: "Pune",
    duration: "24 Hours",
    match: 74,
    status: "Open",
    level: "Beginner",
    color: "green",
    icon: "🌱",
    type: "green"
  },
  {
    id: 6,
    title: "Healthcare AI Sprint",
    category: "Healthcare",
    description: "Use AI and software technology to create better healthcare experiences and intelligent solutions.",
    date: "25 Sep 2026",
    deadline: "21 Sep 2026",
    prize: "₹3,50,000",
    participants: 650,
    location: "Online",
    duration: "48 Hours",
    match: 88,
    status: "Open",
    level: "Intermediate",
    color: "pink",
    icon: "🏥",
    type: "health"
  }
];

export const initialProjects = [
  {
    id: 1,
    name: "AI Study Assistant",
    domain: "AI / Education",
    status: "Active",
    description: "An AI-powered study assistant that helps students create personalized learning plans, summarize lectures, and improve exam productivity.",
    technologies: ["React", "Node.js", "Python", "Machine Learning"],
    members: 4,
    createdAt: "2026-08-20",
    progress: 72,
  },
  {
    id: 2,
    name: "Smart Healthcare Platform",
    domain: "Healthcare / AI",
    status: "Active",
    description: "A secure digital health ecosystem that connects patients, doctors, hospitals and ML diagnostic services.",
    technologies: ["React", "Spring Boot", "PostgreSQL", "Python"],
    members: 4,
    createdAt: "2026-08-15",
    progress: 45,
  },
  {
    id: 3,
    name: "FinTech Smart Ledger",
    domain: "FinTech / Web3",
    status: "Active",
    description: "Automated reconciliation and fraud prevention engine for high-frequency digital payments.",
    technologies: ["React", "FastAPI", "PostgreSQL", "Docker"],
    members: 3,
    createdAt: "2026-08-10",
    progress: 60,
  },
  {
    id: 4,
    name: "Hackathon Team Matcher",
    domain: "Web / AI",
    status: "Completed",
    description: "A smart matching platform that helps hackathon participants discover compatible teammates and build balanced squads.",
    technologies: ["React", "Node.js", "MongoDB", "AI"],
    members: 4,
    createdAt: "2026-07-28",
    progress: 100,
  }
];

export const initialTasks = [
  {
    id: 101,
    projectId: 1,
    title: "Design login and onboarding screen",
    description: "Create the responsive layout and authentication flows.",
    assignedTo: "Priya",
    priority: "High",
    status: "Completed",
  },
  {
    id: 102,
    projectId: 1,
    title: "Build authentication and session API",
    description: "Implement JWT auth endpoints and input validation.",
    assignedTo: "Rohan",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 103,
    projectId: 1,
    title: "Create teammate recommendation model",
    description: "Develop the initial vector similarity and skill matching algorithms.",
    assignedTo: "Aman",
    priority: "Medium",
    status: "To Do",
  },
  {
    id: 104,
    projectId: 1,
    title: "Implement real-time collaboration chat",
    description: "Hook up WebSocket communication for live project discussion.",
    assignedTo: "Sanika",
    priority: "High",
    status: "In Progress",
  }
];

export const initialNotifications = [
  {
    id: 1,
    type: "hackathon",
    icon: "🏆",
    title: "Hackathon registration confirmed",
    message: "You successfully registered for AI Innovation Challenge 2026.",
    time: "10 minutes ago",
    date: "Today",
    unread: true,
    action: "View Hackathon",
    route: "/hackathons"
  },
  {
    id: 2,
    type: "team",
    icon: "👥",
    title: "New teammate match found",
    message: "Aman Khan matches 94% with your required project skills.",
    time: "1 hour ago",
    date: "Today",
    unread: true,
    action: "View Match",
    route: "/teams"
  },
  {
    id: 3,
    type: "project",
    icon: "🚀",
    title: "Project invitation received",
    message: "Rohan Mehta invited you to join the AI Study Assistant project.",
    time: "2 hours ago",
    date: "Today",
    unread: true,
    action: "View Project",
    route: "/projects"
  },
  {
    id: 4,
    type: "message",
    icon: "💬",
    title: "New message from Priya Singh",
    message: "I pushed the updated dashboard components. Please review them.",
    time: "3 hours ago",
    date: "Today",
    unread: false,
    action: "Open Chat",
    route: "/chat"
  },
  {
    id: 5,
    type: "skill",
    icon: "💡",
    title: "Skill gap detected",
    message: "Your project team may need Docker and Kubernetes skills for deployment.",
    time: "5 hours ago",
    date: "Today",
    unread: false,
    action: "Analyze Skills",
    route: "/ai-hub"
  }
];

export const initialTeam = [
  {
    id: 1,
    name: "Sanika Haridas Pandhare",
    role: "Full Stack Developer",
    skills: ["React", "Java", "Spring Boot", "JavaScript", "PostgreSQL"],
    letter: "S",
    isYou: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "UI/UX Designer",
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    letter: "P",
    isYou: false,
  },
  {
    id: 3,
    name: "Rohan Mehta",
    role: "ML Developer",
    skills: ["Python", "TensorFlow", "Pandas", "NLP"],
    letter: "R",
    isYou: false,
  },
  {
    id: 4,
    name: "Aman Khan",
    role: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    letter: "A",
    isYou: false,
  }
];

export const initialAdminUsers = [
  {
    id: "usr-1",
    name: "Sanika Haridas Pandhare",
    email: "sanika@example.com",
    role: "Full Stack Developer",
    skills: "React, Node.js, Spring Boot",
    status: "Active",
    joinedDate: "2026-08-01",
    verified: true
  },
  {
    id: "usr-2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "UI/UX Designer",
    skills: "Figma, Design Systems, UI",
    status: "Active",
    joinedDate: "2026-08-10",
    verified: true
  },
  {
    id: "usr-3",
    name: "Rohan Mehta",
    email: "rohan@example.com",
    role: "ML Engineer",
    skills: "Python, TensorFlow, PyTorch",
    status: "Active",
    joinedDate: "2026-08-12",
    verified: true
  },
  {
    id: "usr-4",
    name: "Aman Khan",
    email: "aman@example.com",
    role: "DevOps Engineer",
    skills: "AWS, Docker, Kubernetes",
    status: "Active",
    joinedDate: "2026-08-14",
    verified: true
  },
  {
    id: "usr-5",
    name: "Neha Patil",
    email: "neha@example.com",
    role: "Backend Developer",
    skills: "Node.js, Express, PostgreSQL",
    status: "Active",
    joinedDate: "2026-08-18",
    verified: false
  }
];

export function AppProvider({ children }) {
  // In-memory state replacing all localStorage usage
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([initialUser]);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [hackathons, setHackathons] = useState(initialHackathons);
  const [registeredHackathons, setRegisteredHackathons] = useState([1]);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [teamMembers, setTeamMembers] = useState(initialTeam);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth methods
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check explicit Admin Login
    if (
      (cleanEmail === "admin@hackathonbuddy.com" || cleanEmail === "admin" || cleanEmail === "admin@example.com") &&
      (password === "admin123" || password === "password123")
    ) {
      setCurrentUser(initialAdmin);
      setIsLoggedIn(true);
      return { success: true, user: initialAdmin, isAdmin: true };
    }

    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      return { success: true, user: found, isAdmin: Boolean(found.isAdmin) };
    }

    // Default demo user fallback
    if (cleanEmail === initialUser.email.toLowerCase() && password === "password123") {
      setCurrentUser(initialUser);
      setIsLoggedIn(true);
      return { success: true, user: initialUser, isAdmin: true };
    }

    return { success: false, message: "Invalid email or password." };
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const registerUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      ...userData,
      firstName: userData.fullName.split(" ")[0] || userData.fullName,
      lastName: userData.fullName.split(" ").slice(1).join(" ") || "",
      skills: userData.techSkills ? userData.techSkills.split(",").map(s => s.trim()).filter(Boolean) : [],
      domains: userData.projectDomains ? userData.projectDomains.split(",").map(d => d.trim()).filter(Boolean) : []
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setAdminUsers((prev) => [
      ...prev,
      {
        id: newUser.id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.primaryRole,
        skills: newUser.techSkills,
        status: "Active",
        joinedDate: new Date().toISOString().split("T")[0],
        verified: true
      }
    ]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    return newUser;
  };

  const updateProfile = (updatedData) => {
    setCurrentUser((prev) => {
      const merged = { ...prev, ...updatedData };
      if (updatedData.skills && typeof updatedData.skills === "object") {
        merged.techSkills = Array.isArray(updatedData.skills) ? updatedData.skills.join(", ") : updatedData.skills;
      }
      if (updatedData.domains && typeof updatedData.domains === "object") {
        merged.projectDomains = Array.isArray(updatedData.domains) ? updatedData.domains.join(", ") : updatedData.domains;
      }
      return merged;
    });
  };

  // Admin Hackathon Management
  const addHackathon = (hackathonData) => {
    const newHackathon = {
      id: Date.now(),
      title: hackathonData.title,
      category: hackathonData.category || "General",
      description: hackathonData.description || "Exciting hackathon challenge with mentorship and prizes.",
      date: hackathonData.date || "TBD",
      deadline: hackathonData.deadline || "TBD",
      prize: hackathonData.prize || "₹1,00,000",
      participants: Number(hackathonData.participants) || 0,
      location: hackathonData.location || "Online",
      duration: hackathonData.duration || "48 Hours",
      match: 90,
      status: hackathonData.status || "Open",
      level: hackathonData.level || "All Levels",
      color: "purple",
      icon: "🚀",
      type: "ai"
    };

    setHackathons((prev) => [newHackathon, ...prev]);
    addNotification({
      type: "hackathon",
      icon: "🏆",
      title: `Admin: Added Hackathon "${newHackathon.title}"`,
      message: `New hackathon challenge is now live in the directory.`,
      action: "View Hackathon",
      route: "/hackathons"
    });
    return newHackathon;
  };

  const deleteHackathon = (hackathonId) => {
    setHackathons((prev) => prev.filter((h) => h.id !== hackathonId));
  };

  const updateHackathonStatus = (hackathonId, status) => {
    setHackathons((prev) =>
      prev.map((h) => (h.id === hackathonId ? { ...h, status } : h))
    );
  };

  // Admin User Management
  const toggleUserStatus = (userId) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
  };

  const deleteAdminUser = (userId) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Hackathons
  const toggleHackathonRegistration = (hackathonId) => {
    setRegisteredHackathons((prev) => {
      if (prev.includes(hackathonId)) {
        return prev.filter((id) => id !== hackathonId);
      } else {
        const hackathon = hackathons.find(h => h.id === hackathonId);
        if (hackathon) {
          addNotification({
            type: "hackathon",
            icon: "🏆",
            title: `Registered: ${hackathon.title}`,
            message: `You have successfully joined ${hackathon.title}. Check your dashboard for updates.`,
            action: "View Hackathon",
            route: "/hackathons"
          });
        }
        return [...prev, hackathonId];
      }
    });
  };

  // Teams
  const addTeamMember = (member) => {
    if (!teamMembers.some((m) => m.id === member.id)) {
      setTeamMembers((prev) => [...prev, { ...member, isYou: false }]);
      addNotification({
        type: "team",
        icon: "🤝",
        title: "Teammate Added",
        message: `${member.name} (${member.role}) was added to your team.`,
        action: "View Team",
        route: "/teams"
      });
    }
  };

  const removeTeamMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  // Projects
  const createProject = (projectData) => {
    const newProj = {
      id: Date.now(),
      name: projectData.name.trim(),
      domain: projectData.domain?.trim() || "General",
      status: "Active",
      description: projectData.description?.trim() || "New hackathon project workspace.",
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : (projectData.technologies || "").split(",").map(t => t.trim()).filter(Boolean),
      members: 1,
      createdAt: new Date().toISOString().split("T")[0],
      progress: 0
    };
    setProjects((prev) => [newProj, ...prev]);
    addNotification({
      type: "project",
      icon: "🚀",
      title: "Project Created",
      message: `Project "${newProj.name}" was successfully initialized.`,
      action: "Open Project",
      route: "/projects"
    });
    return newProj;
  };

  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  };

  // Tasks
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      projectId: taskData.projectId,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || "",
      assignedTo: taskData.assignedTo,
      priority: taskData.priority || "Medium",
      status: "To Do"
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Notifications
  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      time: "Just now",
      date: "Today",
      unread: true,
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        logout,
        registerUser,
        updateProfile,
        hackathons,
        addHackathon,
        deleteHackathon,
        updateHackathonStatus,
        adminUsers,
        toggleUserStatus,
        deleteAdminUser,
        registeredHackathons,
        toggleHackathonRegistration,
        projects,
        createProject,
        deleteProject,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        teamMembers,
        addTeamMember,
        removeTeamMember,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        generatedIdeas,
        setGeneratedIdeas,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
