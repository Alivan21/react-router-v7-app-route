import axios from "axios";
import { SessionAuthCookies } from "../cookies";
import { env } from "../env";

export const httpClient = axios.create({
  baseURL: env.VITE_BASE_API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${SessionAuthCookies.get()}`,
  },
});
