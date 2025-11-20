import Cookies, { CookieSetOptions } from "universal-cookie";

const DEFAULT_OPTIONS: CookieSetOptions = {
  path: "/",
  secure: import.meta.env.PROD,
  sameSite: "strict" as const,
};

const cookies = new Cookies();

export const SessionAuthCookies = {
  /**
   * Get a session cookie value
   * @returns The cookie value or null if not found
   */
  get: (): string | null | undefined => {
    return cookies.get<string>("session_auth");
  },
  /**
   * Set a session cookie value
   * @param value The cookie value
   * @param options Optional cookie options to override defaults
   */
  set: (value: string, options?: Partial<CookieSetOptions>): void => {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    cookies.set("session_auth", value, finalOptions);
  },
  /**
   * Remove the session cookie
   */
  remove: (): void => {
    cookies.remove("session_auth", { path: "/" });
  },
};
