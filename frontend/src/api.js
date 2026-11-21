// src/api.js
import axios from "axios";

// In production, use relative /api (same origin on Vercel); in dev, use localhost:5000
const BASE_URL =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default api;