import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // needed for refresh token cookie
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const { data } = await axios.get("http://localhost:3000/api/auth/refresh", {
          withCredentials: true,
        });

        // Save new access token
        localStorage.setItem("accessToken", data.accessToken);

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/"; // redirect to login
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
