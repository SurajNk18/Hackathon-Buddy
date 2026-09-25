import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hackathon_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("hackathon_token");
      // Don't redirect if we're on auth pages
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/create-profile") &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ───────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (userData) =>
    api.post("/auth/register", userData),

  me: () => api.get("/auth/me"),

  logout: () => {
    localStorage.removeItem("hackathon_token");
  },
};

// ─── HACKATHONS ─────────────────────────────────────────────
export const hackathonAPI = {
  getAll: () => api.get("/hackathons"),
  getRecommended: () => api.get("/hackathons/recommended"),
  getById: (id) => api.get(`/hackathons/${id}`),
  create: (data) => api.post("/hackathons", data),
  delete: (id) => api.delete(`/hackathons/${id}`),
  updateStatus: (id, status) =>
    api.put(`/hackathons/${id}/status?status=${status}`),
};

// ─── REGISTRATIONS ──────────────────────────────────────────
export const registrationAPI = {
  getMyRegistrations: () => api.get("/registrations"),
  register: (hackathonId) => api.post(`/registrations/${hackathonId}`),
  withdraw: (hackathonId) => api.delete(`/registrations/${hackathonId}`),
};

// ─── TEAMS ──────────────────────────────────────────────────
export const teamAPI = {
  getMyTeam: () => api.get("/teams/my-team"),
  getAll: () => api.get("/teams"),
  create: (data) => api.post("/teams", data),
  addMember: (teamId, userId, role) =>
    api.post(`/teams/${teamId}/members?userId=${userId}&role=${role}`),
  getSkillGap: (teamId) => api.get(`/teams/${teamId}/skill-gap`),
};

// ─── NOTIFICATIONS ──────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAllRead: () => api.put("/notifications/mark-all-read"),
  markRead: (id) => api.put(`/notifications/${id}/mark-read`),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete("/notifications"),
};

// ─── PROFILE ────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get("/profile"),
  update: (data) => api.put("/profile", data),
};

// ─── PROJECTS ───────────────────────────────────────────────
export const projectAPI = {
  getRecommendations: () => api.get("/projects/recommendations"),
  generate: (hackathonId) =>
    api.post(`/projects/generate${hackathonId ? `?hackathonId=${hackathonId}` : ""}`),
};

// ─── AI HUB ─────────────────────────────────────────────────
export const aiAPI = {
  findTeammates: (hackathonId) =>
    api.post(`/ai/find-teammates${hackathonId ? `?hackathonId=${hackathonId}` : ""}`),
  skillGap: (teamId) => api.get(`/ai/skill-gap/${teamId}`),
  generateIdeas: (hackathonId, category) =>
    api.post(
      `/ai/generate-ideas?category=${category || "General"}${hackathonId ? `&hackathonId=${hackathonId}` : ""}`
    ),
  matchScore: (hackathonId) => api.get(`/ai/match-score/${hackathonId}`),
};

// ─── ADMIN ──────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get("/admin/stats"),
};

// ─── DASHBOARD ──────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};

export default api;
