import Cookies, { CookieSetOptions } from "universal-cookie";

const DEFAULT_OPTIONS: CookieSetOptions = {
  path: "/",
  secure: import.meta.env.PROD,
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const cookies = new Cookies();

export const SessionAuthCookies = {
  /**
   * Get a session cookie value
   * @returns The cookie value or null if not found
   */
  get: () => cookies.get("session_auth") as string | null | undefined,
  /**
   * Set a session cookie value
   * @param value The cookie value
   * @param options Optional cookie options to override defaults
   */
  set: (value: string, options?: Partial<CookieSetOptions>) =>
    cookies.set("session_auth", value, { ...DEFAULT_OPTIONS, ...options }),
  /**
   * Remove the session cookie
   */
  remove: () => cookies.remove("session_auth", DEFAULT_OPTIONS),
};
