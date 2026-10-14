import axios from "axios";
import { getSession, clearSession } from "./session";

// In development, Vite forwards /api to http://localhost:8081 (see vite.config.js).
// For a deployed site, set VITE_API_BASE_URL (e.g. https://my-backend.com/api/v1).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 15000,
});

// Send the login token with every request.
api.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// An expired or invalid token: log out, and retry public GET requests without it.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    if (error.response?.status === 401 && getSession()?.token && config?.method === "get") {
      clearSession();
      if (config && config.method === "get" && !config._retried) {
        config._retried = true;
        delete config.headers.Authorization;
        return api.request(config);
      }
      const protectedPath = /^\/(cart|wishlist|checkout|payment)/.test(
        window.location.pathname
      );
      if (protectedPath) window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Turns any error into a message that can be shown to the person.
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const data = error?.response?.data;
  const validationErrors = data?.validationErrors || data?.errors;
  if (validationErrors && Object.keys(validationErrors).length > 0) {
    return Object.values(validationErrors).join(" ");
  }
  if (data?.message) return data.message;
  if (error?.isAxiosError && !error.response) {
    return "Cannot reach the server. Check that the backend is running.";
  }
  if (!error?.isAxiosError && error?.message) return error.message;
  return fallback;
};

export default api;
