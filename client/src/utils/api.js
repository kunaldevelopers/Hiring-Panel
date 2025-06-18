import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  adminLogin: (credentials) => api.post("/auth/admin/login", credentials),
  changePassword: (passwordData) =>
    api.post("/auth/change-password", passwordData),
  changeUsername: (usernameData) =>
    api.post("/auth/change-username", usernameData),
  changeAdminPassword: (passwordData) =>
    api.post("/auth/admin/change-password", passwordData),
};

export const applicationAPI = {
  submit: (formData) =>
    api.post("/applications/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getProfile: () => api.get("/applications/profile"),
  updateProfile: (formData) =>
    api.patch("/applications/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const adminAPI = {
  getApplications: (params) => api.get("/admin/applications", { params }),
  getApplication: (id) => api.get(`/admin/applications/${id}`),
  updateStatus: (id, status) =>
    api.patch(`/admin/applications/${id}/status`, { status }),
  scheduleInterview: (id, scheduleData) =>
    api.patch(`/admin/applications/${id}/schedule`, scheduleData),
  deleteApplication: (id) => api.delete(`/admin/applications/${id}`),
  bulkDeleteApplications: (ids) =>
    api.post("/admin/applications/bulk-delete", { ids }),
  getStats: () => api.get("/admin/stats"),
  exportCSV: () => api.get("/admin/export", { responseType: "blob" }),
};

export const jobPositionAPI = {
  getPositions: () => api.get("/job-positions"),
  getAllPositions: () => api.get("/job-positions/admin"),
  createPosition: (positionData) => api.post("/job-positions", positionData),
  updatePosition: (id, positionData) =>
    api.put(`/job-positions/${id}`, positionData),
  deletePosition: (id) => api.delete(`/job-positions/${id}`),
};

export default api;
