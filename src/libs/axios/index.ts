import axios, { AxiosError } from "axios";
import { redirect } from "react-router";
import { SessionAuthCookies } from "../cookies";
import { env } from "../env";

export const httpClient = axios.create({
  baseURL: env.VITE_BASE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${SessionAuthCookies.get()}`,
  },
});

// Flag to prevent multiple logout attempts during concurrent requests
let isLoggingOut = false;

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Check if the error is due to an unauthorized request (401)
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      // Clear auth data
      SessionAuthCookies.remove();
      httpClient.defaults.headers.common.Authorization = undefined;

      // Dispatch a custom event that the SessionProvider can listen for
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));

      redirect(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }

    return Promise.reject(error);
  }
);
