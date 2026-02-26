'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getToken,
  getUser,
  saveUser,
  login as authLogin,
  logout as authLogout,
  validateToken,
  type GitHubUser,
} from '@/lib/auth-client';

interface AuthContextType {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount and validate token
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getUser();

      if (token && savedUser) {
        // Validate token is still valid
        const validatedUser = await validateToken(token);

        if (validatedUser) {
          // Token is valid, update user info in case it changed
          saveUser(validatedUser);
          setUser(validatedUser);
        } else {
          // Token is invalid or expired, clear auth
          authLogout();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    const result = await authLogin(token);

    if (result.success && result.user) {
      setUser(result.user);
    }

    return { success: result.success, error: result.error };
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
