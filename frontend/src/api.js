// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API URL
});

export default api; // ✅ make sure this is default export
