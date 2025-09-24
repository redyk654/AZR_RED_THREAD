// src/utils/accesPermition/permissionContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMsalUser } from "./useMsalUser";

/**
 * PermissionProvider :
 * - récupère l'utilisateur via useMsalUser
 * - charge les permissions (roles) — ici on illustre 2 sources :
 *   1) claims (idToken) : account.idTokenClaims.roles ou groups
 *   2) appel à ton backend pour récupérer des droits supplémentaires
 *
 * Le provider expose { permissions, isAdmin, loading }.
 */

type Permissions = string[];

interface PermissionContextValue {
  permissions: Permissions;
  isAdmin: boolean;
  loading: boolean;
}

const PermissionContext = createContext<PermissionContextValue>({ permissions: [], isAdmin: false, loading: true });

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: userLoading } = useMsalUser();
  const [permissions, setPermissions] = useState<Permissions>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPermissions() {
      setLoading(true);

      // source 1: claims (id token) si disponible
      const claimRoles: string[] = [];
      try {
        const account = user?.account as any;
        const claims = account?.idTokenClaims;
        if (claims) {
          // roles claim standard
          if (Array.isArray(claims.roles)) claimRoles.push(...claims.roles);
          // group claims (si configuré), on peut mapper
          if (Array.isArray(claims.groups)) claimRoles.push(...claims.groups);
        }
      } catch {
        // ignore
      }

      // source 2 : appel backend (optionnel) — example placeholder :
      // const backendRoles = await fetch(`/api/users/permissions?email=${encodeURIComponent(user?.email ?? "")}`).then(r => r.json());

      const merged = Array.from(new Set([...claimRoles /*, ...backendRoles*/]));

      if (mounted) {
        setPermissions(merged);
        setLoading(false);
      }
    }

    if (!userLoading) {
      loadPermissions();
    }

    return () => {
      mounted = false;
    };
  }, [user, userLoading]);

  const isAdmin = permissions.includes("admin") || permissions.includes("ROLE_ADMIN");

  return <PermissionContext.Provider value={{ permissions, isAdmin, loading }}>{children}</PermissionContext.Provider>;
};

export const usePermissions = () => useContext(PermissionContext);
