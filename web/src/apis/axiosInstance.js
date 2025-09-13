import axios from "axios";

// Get the backend URL from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies (like auth tokens) with every request
});

// You can add interceptors here later for handling auth tokens, etc.

export default axiosInstance;
