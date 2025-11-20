import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { login as loginApi, logout as logoutApi } from "@/api/auth";
import { TLoginRequest } from "@/api/auth/schema";
import { TUserData } from "@/common/types/user";
import { calculateMaxAge } from "@/common/utils/calculate-max-age";
import { decodeJwt } from "@/common/utils/jwt";
import { httpClient } from "@/libs/axios";
import { SessionAuthCookies } from "@/libs/cookies";

type SessionContextType = {
  isAuthenticated: boolean;
  user: TUserData | null;
  token: string | null;
  login: (credentials: TLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | null>(null);

function initializeSession() {
  const storedToken = SessionAuthCookies.get();
  if (!storedToken) {
    return { token: null, user: null, isAuthenticated: false };
  }

  try {
    const decodedUser = decodeJwt<TUserData>(storedToken);

    // Validate token expiry
    if (decodedUser.exp && decodedUser.exp * 1000 <= Date.now()) {
      clearSession();
      return { token: null, user: null, isAuthenticated: false };
    }

    httpClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    return {
      token: storedToken,
      user: decodedUser,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Failed to restore session:", error);
    clearSession();
    return { token: null, user: null, isAuthenticated: false };
  }
}

function clearSession() {
  SessionAuthCookies.remove();
  httpClient.defaults.headers.common.Authorization = undefined;
}

/**
 * SessionProvider manages authentication state for the application
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionState, setSessionState] = useState(() => initializeSession());
  const [isLoading, setIsLoading] = useState(false);

  // Listen for unauthorized events from axios interceptor
  useEffect(() => {
    function handleUnauthorized() {
      setSessionState({ token: null, user: null, isAuthenticated: false });
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  async function login(credentials: TLoginRequest) {
    try {
      setIsLoading(true);
      const response = await loginApi(credentials);
      const { token: sessionToken, expires_at } = response.data;

      const decodedUser = decodeJwt<TUserData>(sessionToken);
      const maxAge = calculateMaxAge(expires_at ?? decodedUser.exp);

      SessionAuthCookies.set(sessionToken, { maxAge });
      httpClient.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;

      setSessionState({
        token: sessionToken,
        user: decodedUser,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      clearSession();
      setSessionState({ token: null, user: null, isAuthenticated: false });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      await logoutApi();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearSession();
      setSessionState({ token: null, user: null, isAuthenticated: false });
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      setIsLoading(false);
    }
  }

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      isAuthenticated: sessionState.isAuthenticated,
      user: sessionState.user,
      token: sessionState.token,
      login,
      logout,
      isLoading,
    }),
    [sessionState.isAuthenticated, sessionState.user, sessionState.token, isLoading]
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

/**
 * Hook to access session context
 * @throws {Error} If used outside SessionProvider
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
