// ============================================================
//  Hackathon Buddy — Central API Client
//  All communication with Spring Boot backend goes here.
//  Base URL: http://localhost:8080
// ============================================================

const BASE_URL = "http://localhost:8080";

// ──────────────────────────────────────────────────────────
//  JWT helpers
// ──────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem("hb_jwt");
export const setToken = (token) => localStorage.setItem("hb_jwt", token);
export const clearToken = () => localStorage.removeItem("hb_jwt");

/** Store full user object (name, email, role) after login/register */
export const setCurrentUser = (user) =>
  localStorage.setItem("hackathonBuddyCurrentUser", JSON.stringify(user));

export const getCurrentUserLocal = () => {
  try {
    return JSON.parse(localStorage.getItem("hackathonBuddyCurrentUser")) || null;
  } catch {
    return null;
  }
};

export const clearCurrentUser = () =>
  localStorage.removeItem("hackathonBuddyCurrentUser");

// ──────────────────────────────────────────────────────────
//  Base fetch wrapper
// ──────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    // No JSON body (e.g. 204)
    data = null;
  }

  if (!response.ok) {
    // Backend returns { success, message, data } — surface message to UI
    const message =
      data?.message || data?.error || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ──────────────────────────────────────────────────────────
//  Auth
// ──────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Maps to: POST /api/auth/register
 * @param {{ firstName, lastName, email, password, phone? }} payload
 */
export async function registerUser({ firstName, lastName, email, password, phone }) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password, phone }),
  });
  // data.data = { token, user }
  const { token, user } = data.data;
  setToken(token);
  setCurrentUser({
    fullName: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    primaryRole: user.role,
    profileComplete: user.profileComplete,
  });
  return { token, user };
}

/**
 * Login an existing user.
 * Maps to: POST /api/auth/login
 * @param {{ email, password }} payload
 */
export async function loginUser({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const { token, user } = data.data;
  setToken(token);
  setCurrentUser({
    fullName: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    primaryRole: user.role,
    profileComplete: user.profileComplete,
  });
  return { token, user };
}

/**
 * Get current authenticated user info.
 * Maps to: GET /api/auth/me
 */
export async function getAuthMe() {
  const data = await apiFetch("/api/auth/me");
  return data.data;
}

/**
 * Logout — clears token + user from storage.
 */
export function logout() {
  clearToken();
  clearCurrentUser();
}

// ──────────────────────────────────────────────────────────
//  Hackathons
// ──────────────────────────────────────────────────────────

/**
 * Get all hackathons.
 * Maps to: GET /api/hackathons
 * @returns {Promise<Array>}
 */
export async function getHackathons() {
  const data = await apiFetch("/api/hackathons");
  return data.data || [];
}

/**
 * Get recommended hackathons for the current user.
 * Maps to: GET /api/hackathons/recommended
 * @returns {Promise<Array>}
 */
export async function getRecommendedHackathons() {
  const data = await apiFetch("/api/hackathons/recommended");
  return data.data || [];
}

/**
 * Get upcoming hackathons.
 * Maps to: GET /api/hackathons/upcoming
 * @returns {Promise<Array>}
 */
export async function getUpcomingHackathons() {
  const data = await apiFetch("/api/hackathons/upcoming");
  return data.data || [];
}

/**
 * Get a single hackathon by ID.
 * Maps to: GET /api/hackathons/{id}
 */
export async function getHackathonById(id) {
  const data = await apiFetch(`/api/hackathons/${id}`);
  return data.data;
}

// ──────────────────────────────────────────────────────────
//  Dashboard
// ──────────────────────────────────────────────────────────

/**
 * Get dashboard statistics for the current user.
 * Maps to: GET /api/dashboard/stats
 */
export async function getDashboardStats() {
  const data = await apiFetch("/api/dashboard/stats");
  return data.data;
}

// ──────────────────────────────────────────────────────────
//  Activity
// ──────────────────────────────────────────────────────────

/**
 * Get recent activity feed for the current user.
 * Maps to: GET /api/activity
 * @returns {Promise<Array>}
 */
export async function getRecentActivity() {
  const data = await apiFetch("/api/activity");
  return data.data || [];
}

// ──────────────────────────────────────────────────────────
//  Registrations
// ──────────────────────────────────────────────────────────

/**
 * Register for a hackathon.
 * Maps to: POST /api/registrations/{hackathonId}
 */
export async function registerForHackathon(hackathonId) {
  const data = await apiFetch(`/api/registrations/${hackathonId}`, {
    method: "POST",
  });
  return data;
}

/**
 * Withdraw from a hackathon.
 * Maps to: DELETE /api/registrations/{hackathonId}
 */
export async function withdrawFromHackathon(hackathonId) {
  const data = await apiFetch(`/api/registrations/${hackathonId}`, {
    method: "DELETE",
  });
  return data;
}

/**
 * Get all hackathons the current user has registered for.
 * Maps to: GET /api/registrations
 * @returns {Promise<Array>}
 */
export async function getMyRegistrations() {
  const data = await apiFetch("/api/registrations");
  return data.data || [];
}
