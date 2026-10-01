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

// Handle 401/403 responses
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
    if (error.response && error.response.status === 403) {
      console.warn("Access Denied (403):", error.response.data?.message || "You do not have permission.");
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
  register: (hackathonId, formData = {}) =>
    api.post(`/registrations/${hackathonId}`, formData),
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

// ─── SUPER ADMIN ────────────────────────────────────────────
export const superAdminAPI = {
  getStats: () => api.get("/super-admin/stats"),
  getUsers: () => api.get("/super-admin/users"),
  getRoles: () => api.get("/super-admin/roles"),
  assignRole: (userId, roleName) =>
    api.put(`/super-admin/users/${userId}/assign-role?roleName=${roleName}`),
  toggleStatus: (userId) =>
    api.put(`/super-admin/users/${userId}/toggle-status`),
  deleteUser: (userId) => api.delete(`/super-admin/users/${userId}`),
  resetPassword: (userId, newPassword) =>
    api.put(`/super-admin/users/${userId}/reset-password?newPassword=${newPassword}`),
  createAdmin: (data) => api.post("/super-admin/create-admin", data),
};

// ─── HACKATHON ADMIN ────────────────────────────────────────
export const hackathonAdminAPI = {
  getMyHackathons: () => api.get("/hackathon-admin/my-hackathons"),
  getRegistrations: (hackathonId) =>
    api.get(`/hackathon-admin/hackathons/${hackathonId}/registrations`),
  sendAnnouncement: (data) => api.post("/hackathon-admin/announcements", data),
  getAnnouncements: () => api.get("/hackathon-admin/announcements"),
  getStats: () => api.get("/hackathon-admin/stats"),
};

// ─── DEVELOPER ADMIN ────────────────────────────────────────
export const developerAdminAPI = {
  getStats: () => api.get("/developer-admin/stats"),
  getDevelopers: () => api.get("/developer-admin/developers"),
  getUsers: () => api.get("/developer-admin/users"),
  toggleStatus: (userId) =>
    api.put(`/developer-admin/developers/${userId}/toggle-status`),
  getActivity: () => api.get("/developer-admin/activity"),
};

// ─── DASHBOARD ──────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};

// ─── CHAT ───────────────────────────────────────────────────
export const chatAPI = {
  getMessages: (conversationId) =>
    api.get(`/chat/${conversationId}/messages`),
};

export default api;
