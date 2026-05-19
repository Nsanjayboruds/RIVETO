// frontend/src/utils/apiClient.js
import axios from 'axios'; // ✅ FIX #1: import axios, NOT self-reference

// Named event so App.jsx (and any component) can listen for errors
export const API_ERROR_EVENT = "riveto:api-error";

const apiClient = axios.create({ // ✅ FIX #2: axios.create(), not apiClient.create()
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // ✅ FIX #3: Vite env syntax
  withCredentials: true,
});

// ─── Request Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (Central Error Handler) ───────────────────────────
apiClient.interceptors.response.use(
  (response) => response, // pass through successful responses untouched

  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Map status codes → friendly messages
    const MESSAGE_MAP = {
      400: serverMessage || "Invalid request. Please check your input.",
      401: "Session expired. Please log in again.",
      403: "You don't have permission to do that.",
      404: "The requested resource was not found.",
      409: serverMessage || "A conflict occurred. Please try again.",
      422: serverMessage || "Validation failed. Check your input.",
      429: "Too many requests. Please slow down.",
      500: "Server error. Our team has been notified.",
      502: "Service temporarily unavailable.",
      503: "Server is under maintenance. Try again shortly.",
    };

    const message =
      MESSAGE_MAP[status] ||
      serverMessage ||
      error.message ||
      "An unexpected error occurred.";

    // Fire a custom DOM event — App.jsx listens to this and shows a toast
    window.dispatchEvent(
      new CustomEvent(API_ERROR_EVENT, {
        detail: { message, status },
      })
    );

    // Redirect to login on 401
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;