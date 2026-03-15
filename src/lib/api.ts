import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: object) => api.post("/auth/register", data),
  login: (data: object) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  changePassword: (data: object) => api.put("/auth/change-password", data),
};

// ── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getDashboard: () => api.get("/dashboard"),
  updateProfile: (data: object) => api.put("/dashboard/profile", data),
};

// ── AI Agents ───────────────────────────────────────────────────────────────
export const agentApi = {
  dispatch: (agentType: string, payload: object) =>
    api.post("/agents/dispatch", { agentType, ...payload }),
  getDailyFlow: () => api.get("/agents/daily-flow"),
};

// ── Notes ───────────────────────────────────────────────────────────────────
export const notesApi = {
  getAll: (subject?: string) => api.get("/notes", { params: { subject } }),
  getOne: (id: string) => api.get(`/notes/${id}`),
  create: (data: object) => api.post("/notes", data),
  update: (id: string, data: object) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// ── Maths ───────────────────────────────────────────────────────────────────
export const mathsApi = {
  solve: (data: object) => api.post("/maths/solve", data),
  getHistory: () => api.get("/maths/history"),
};

// ── Questions ───────────────────────────────────────────────────────────────
export const questionApi = {
  getAll: (subject?: string, topic?: string) =>
    api.get("/questions", { params: { subject, topic } }),
  create: (data: object) => api.post("/questions", data),
};

// ── Study Logs ──────────────────────────────────────────────────────────────
export const studyLogApi = {
  create: (data: object) => api.post("/study-logs", data),
  getAll: (params?: object) => api.get("/study-logs", { params }),
};

// ── Parent ──────────────────────────────────────────────────────────────────
export const parentApi = {
  linkStudent: (data: object) => api.post("/parent/link", data),
  getInsights: (studentId: string) => api.get(`/parent/insights/${studentId}`),
  getLinkedStudents: () => api.get("/parent/students"),
};

// ── Mentor ──────────────────────────────────────────────────────────────────
export const mentorApi = {
  getMessage: () => api.get("/mentor/message"),
  chat: (messages: Array<{ role: "user" | "assistant"; content: string }>) =>
    fetch(`${API_URL}/mentor/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`,
      },
      body: JSON.stringify({ messages }),
    }),
};

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => api.get("/profile"),
  update: (data: object) => api.put("/profile", data),
};

// ── Streak & Missions ────────────────────────────────────────────────────────
export const streakApi = {
  getStreak: () => api.get("/streak"),
  getMissions: () => api.get("/streak/missions"),
  completeTask: (taskId: string) =>
    api.post(`/streak/missions/${taskId}/complete`),
  getPowerHourSchedule: () => api.get("/streak/power-hour/schedule"),
  setPowerHourSchedule: (hour: number, minute: number) =>
    api.post("/streak/power-hour/schedule", { hour, minute }),
};

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const leaderboardApi = {
  getLeaderboard: () => api.get("/leaderboard"),
};

export default api;
