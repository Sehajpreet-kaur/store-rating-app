import axios from "axios";

// One configured client for the whole app.
// withCredentials makes the browser send the httpOnly auth cookie on every request.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default axiosInstance;
