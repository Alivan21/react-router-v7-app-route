import axios, { AxiosError } from "axios";
import { redirect } from "react-router";
import { SessionAuthCookies } from "../cookies";
import { env } from "../env";

export const httpClient = axios.create({
  baseURL: env.VITE_BASE_API_URL,
});

// Flag to prevent multiple logout attempts during concurrent requests
let isLoggingOut = false;

// Request interceptor: Always use the latest token from cookies
httpClient.interceptors.request.use(
  (config) => {
    const token = SessionAuthCookies.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

// Response interceptor: Handle 401 errors
httpClient.interceptors.response.use(
  (response) => {
    // Reset logout flag on successful response
    isLoggingOut = false;
    return response;
  },
  async (error: AxiosError) => {
    // Check if the error is due to an unauthorized request (401)
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      // Clear auth data
      SessionAuthCookies.remove();
      httpClient.defaults.headers.common.Authorization = undefined;

      // Dispatch a custom event that the SessionProvider can listen for
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));

      // Reset flag after a delay
      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);

      redirect(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }

    return Promise.reject(error);
  }
);
