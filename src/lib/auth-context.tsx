import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "./api";

export type UserRole = "tenant" | "landlord" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("homerent_token");
    const savedUser = localStorage.getItem("homerent_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("homerent_token");
        localStorage.removeItem("homerent_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<User> => {
    const { data } = await authApi.login(identifier, password);
    localStorage.setItem("homerent_token", data.token);
    localStorage.setItem("homerent_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("homerent_token");
    localStorage.removeItem("homerent_user");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("homerent_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
