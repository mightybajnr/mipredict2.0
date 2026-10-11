import { useCallback, useEffect, useState } from "react";

import { authService } from "../services/authService.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authService
      .me()
      .then((result) => {
        if (active) setUser(result.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const result = await authService.me();
      setUser(result.user ?? null);
      return result.user ?? null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    await refreshUser();
    return result;
  };

  const signup = async (details) => {
    const result = await authService.signup(details);
    await refreshUser();
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}