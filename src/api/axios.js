import axios from "axios";

// Point this at your real backend when you wire it up.
export const API_ORIGIN = "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_ORIGIN}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
