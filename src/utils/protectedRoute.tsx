// src/utils/protectedRoute.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { msalInstance, loginRequest } from "./msalConfig";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import type { InteractionRequiredAuthError } from "@azure/msal-browser";

/**
 * AuthProvider :
 * - initialise MSAL via MsalProvider (wrapper)
 * - sur mount, vérifie l'auth (accounts) et lance loginRedirect si nécessaire
 * - expose isAuthenticated et account via context
 *
 * withAuth HOC : protège un composant (redirection vers Azure AD si non authentifié)
 */

interface AuthContextValue {
  isAuthenticated: boolean;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isAuthenticated: false, initializing: true });

export const useAuth = () => useContext(AuthContext);

/**
 * IMPORTANT:
 * - Wrap your _app.tsx with <MsalProvider instance={msalInstance}><AuthProvider>...</AuthProvider></MsalProvider>
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          // Pas d'utilisateur connecté - déclenche redirect login (silent fallback)
          try {
            // Tentative de loginRedirect si nécessaire (commenter si tu veux bouton explicite)
            await msalInstance.loginRedirect(loginRequest);
          } catch (err) {
            console.error("MSAL loginRedirect error:", err);
          }
        } else {
          if (mounted) setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setInitializing(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, initializing }}>{children}</AuthContext.Provider>;
};

/**
 * Higher order component to protect components/pages
 * Usage:
 * export default withAuth(MyComponent)
 */
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedWrapper(props: T) {
    const { isAuthenticated, initializing } = useAuth();

    if (initializing) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Redirection vers la page de connexion...</div>;

    return <Component {...props} />;
  };
}
