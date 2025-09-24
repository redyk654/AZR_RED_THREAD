// src/utils/protectedRoute.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { msalInstance, loginRequest } from "./msalConfig";

interface AuthContextValue {
  isAuthenticated: boolean;
  initializing: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  initializing: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie si un utilisateur est déjà connecté
  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setIsAuthenticated(true);
    }
    setInitializing(false);
  }, []);

  const login = async () => {
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      console.error("Erreur login MSAL:", err);
    }
  };

  const logout = () => {
    msalInstance.logoutRedirect().catch((err) => {
      console.error("Erreur logout MSAL:", err);
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
