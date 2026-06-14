import { createContext, useContext, useState } from "react";
import type { CurrentUser } from "../types";

type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(token: string, user: CurrentUser) {
    localStorage.setItem("auth-token", token);
    setIsAuthenticated(true);
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
