import axios from "axios";

const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE =
  envBase ||
  localStorage.getItem("HOMERENT_API") ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:7501"
    : "");

const api = axios.create({ baseURL: API_BASE, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("homerent_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("homerent_token");
      localStorage.removeItem("homerent_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    const msg = err.response?.data?.message || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

// Auth
export const authApi = {
  login: (identifier: string, password: string) =>
    api.post("/auth/login", { identifier, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  verifyOtp: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),
  resendOtp: (email: string) =>
    api.post("/auth/resend-otp", { email }),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { currentPassword, newPassword }),
  uploadProfileImage: (formData: FormData) =>
    api.post("/auth/me/profile-image", formData),
  deleteProfileImage: () =>
    api.delete("/auth/me/profile-image"),
};

// Properties
export const propertiesApi = {
  list: () => api.get("/properties"),
  get: (id: number) => api.get(`/properties/${id}`),
  create: (formData: FormData) => api.post("/properties", formData),
};

// Rentals
export const rentalsApi = {
  my: () => api.get("/rentals/my"),
  create: (body: { propertyId: number; startDate: string; endDate: string }) =>
    api.post("/rentals", body),
  approve: (id: number) => api.put(`/rentals/${id}/approve`),
  reject: (id: number) => api.put(`/rentals/${id}/reject`),
  terminate: (id: number) => api.put(`/rentals/${id}/terminate`),
  cancel: (id: number) => api.put(`/rentals/${id}/cancel`),
};

// Payments
export const paymentsApi = {
  my: () => api.get("/payments/my"),
  tenantEarnings: () => api.get("/payments/tenants"),
  list: () => api.get("/payments"),
  create: (formData: FormData) => api.post("/payments", formData),
  approve: (id: number) => api.put(`/payments/${id}/approve`),
  reject: (id: number) => api.put(`/payments/${id}/reject`),
};

// Messages
export const messagesApi = {
  conversations: () => api.get("/messages/conversations"),
  messages: (conversationId: number) => api.get(`/messages/${conversationId}`),
  send: (conversationId: number, content?: string, file?: File) => {
    const fd = new FormData();
    fd.append("conversationId", String(conversationId));
    if (content?.trim()) fd.append("content", content.trim());
    if (file) {
      const field = file.type.startsWith("video/") ? "video" : "image";
      fd.append(field, file, file.name);
    }
    return api.post("/messages", fd);
  },
  startAdminChat: (landlordId: number) =>
    api.post("/messages/admin/start", { landlordId }),
};

// Applications
export const applicationsApi = {
  apply: (formData: FormData) => api.post("/applications", formData),
  list: () => api.get("/applications"),
  approve: (id: number) => api.put(`/applications/${id}/approve`),
  reject: (id: number) => api.put(`/applications/${id}/reject`),
};

// Users
export const usersApi = {
  list: () => api.get("/users"),
  suspend: (id: number) => api.put(`/users/${id}/suspend`),
  unsuspend: (id: number) => api.put(`/users/${id}/unsuspend`),
};

export default api;
