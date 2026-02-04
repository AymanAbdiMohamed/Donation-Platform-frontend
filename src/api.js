import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// To attach token automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // expected { user, access_token }
};

// registerUser(email, password, role)
export const registerUser = async ({ email, password, role }) => {
  const response = await api.post("/auth/register", { email, password, role });
  return response.data; // expected { user, access_token }
};

// get logged in user from token
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data; // expected { user }
};

export const getPendingApplications = async () => {
  const response = await api.get("/admin/applications?status=pending");
  return response.data; // expected: array of applications
};

// 2) Approve application
export const approveApplication = async (applicationId) => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/approve`,
  );
  return response.data;
};

// 3) Reject application (optional reason)
export const rejectApplication = async (applicationId, reason = "") => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/reject`,
    { reason },
  );
  return response.data;
};

export default api;
