import React, { createContext, useEffect, useState, ReactNode, JSX } from "react";
import { login, logout } from "@/api/auth/api";
import { TLoginRequest } from "@/api/auth/schema";
import { SessionAuthCookies } from "@/libs/cookies";
import { decodeJwt, JwtPayload as BaseJwtPayload } from "@/utils/jwt";

interface SessionContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  login: (credentials: TLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// User data parsed from the JWT token
interface UserData extends BaseJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const SessionContext = createContext<SessionContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

/**
 * SessionProviderProps interface for the SessionProvider component
 * @interface SessionProviderProps
 * @property {ReactNode} children - The child components
 */
interface SessionProviderProps {
  children: ReactNode;
}

/**
 * SessionProvider component to manage authentication state
 * @param {SessionProviderProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}: SessionProviderProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from cookies on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = SessionAuthCookies.get();

      if (storedToken) {
        const userData = decodeJwt<UserData>(storedToken);
        if (userData) {
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          SessionAuthCookies.remove();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials: TLoginRequest) => {
    try {
      setIsLoading(true);
      const response = await login(credentials);
      const { token, expires_at } = response.data;

      // Save token to cookie with expiration from the API response
      const expiryDate = new Date(expires_at);
      SessionAuthCookies.set(token, {
        expires: expiryDate,
      });

      // Update state
      setToken(token);
      setUser(decodeJwt<UserData>(token));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      // Clear auth state
      SessionAuthCookies.remove();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: SessionContextType = {
    isAuthenticated,
    user,
    token,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

/**
 * Hook for accessing session context
 * @returns {SessionContextType} The session context
 * @throws {Error} If used outside of SessionProvider
 */
export const useSession = (): SessionContextType => {
  const context = React.useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
