// frontend/src/api.js
import axios from "axios";

// Bulletproof URL resolver:
// In browser on production (e.g. *.vercel.app), NEVER use localhost — use relative /api
export function getBaseUrl() {
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    if (
      process.env.REACT_APP_API_URL &&
      !process.env.REACT_APP_API_URL.includes("localhost")
    ) {
      return process.env.REACT_APP_API_URL;
    }
    return "";
  }
  return process.env.REACT_APP_API_URL || "http://localhost:5000";
}

const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});

// Interceptor to ensure baseURL updates dynamically if host changes
api.interceptors.request.use((config) => {
  if (!config.baseURL || config.baseURL.includes("localhost")) {
    config.baseURL = `${getBaseUrl()}/api`;
  }
  return config;
});

export default api;
