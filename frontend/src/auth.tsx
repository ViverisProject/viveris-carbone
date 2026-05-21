import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getToken,
  getStoredUser,
  setStoredUser,
  clearToken,
  userApi,
  UserObject,
} from "./api";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: UserObject | null;
  isAuthenticated: boolean;
  setUser: (u: UserObject | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserObject | null>(() =>
    getStoredUser()
  );

  const isAuthenticated = Boolean(getToken());

  const setUser = (u: UserObject | null) => {
    if (u) {
      setStoredUser(u);
    } else {
      clearToken();
    }
    setUserState(u);
  };

  const logout = () => {
    clearToken();
    setUserState(null);
    // Clear the persisted query cache so the next user starts fresh
    localStorage.removeItem("viv_query_cache");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function PrivateRoute({ Component }: { Component: React.ComponentType<any> }) {
  const token = getToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasCachedProfile = Boolean(queryClient.getQueryData(["profile"]));
  const [validating, setValidating] = useState(!hasCachedProfile);

  useEffect(() => {
    let mounted = true;
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // If already cached, validate silently in background
    if (hasCachedProfile) return;

    (async () => {
      try {
        // validate token by fetching profile
        await userApi.getMe();
        if (mounted) setValidating(false);
      } catch (err) {
        clearToken();
        if (mounted) navigate("/login", { replace: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, navigate]);

  // While validation or redirecting, render a small loader
  if (!token) return null;
  if (validating)
    return (
      <div className="min-h-screen flex items-center justify-center">Chargement…</div>
    );

  return <Component />;
}
