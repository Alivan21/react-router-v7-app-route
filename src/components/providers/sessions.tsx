import React, { use } from "react";
import { login, logout } from "@/api/auth";
import { TLoginRequest } from "@/api/auth/schema";
import { UserData } from "@/common/types/user";
import { httpClient } from "@/libs/axios";
import { SessionAuthCookies } from "@/libs/cookies";
import { decodeJwt } from "@/utils/jwt";

type SessionContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  login: (credentials: TLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const SessionContext = React.createContext<SessionContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

type SessionProviderProps = {
  children: React.ReactNode;
};

/**
 * SessionProvider component to manage authentication state
 * @param {SessionProviderProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}: SessionProviderProps): React.JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserData | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const initializeAuth = () => {
      const storedToken = SessionAuthCookies.get();

      if (storedToken) {
        httpClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        const userData = decodeJwt<UserData>(storedToken);
        if (userData) {
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        SessionAuthCookies.remove();
        httpClient.defaults.headers.common.Authorization = undefined;
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
      httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;

      const expiryDate = new Date(expires_at);
      SessionAuthCookies.set(token, {
        expires: expiryDate,
      });

      setToken(token);
      setUser(decodeJwt<UserData>(token));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      SessionAuthCookies.remove();
      httpClient.defaults.headers.common.Authorization = undefined;
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

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      login: handleLogin,
      logout: handleLogout,
      isLoading,
    }),
    [isAuthenticated, user, token, isLoading]
  );

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

/**
 * Hook for accessing session context
 * @returns {SessionContextType} The session context
 * @throws {Error} If used outside of SessionProvider
 */
export const useSession = (): SessionContextType => {
  const context = use(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
