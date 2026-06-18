import axios from "axios";

const API = axios.create({
  baseURL:
    "https://edunexus-backend-ps02.onrender.com",
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default API;