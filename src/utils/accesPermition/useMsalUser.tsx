// src/utils/accesPermition/useMsalUser.tsx
"use client";

import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";
import { callGraphApi } from "../graph";
import { graphRequest } from "../msalConfig";

export interface MsalUser {
  account?: AccountInfo | null;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  graphProfile?: any; // raw Graph profile if you need it
}

/**
 * Hook qui retourne les informations de l'utilisateur connecté (issu de MSAL / Graph).
 * - essaye d'obtenir un token silent et appelle Graph pour le profil.
 */
export function useMsalUser(): { user: MsalUser | null; loading: boolean; error?: string } {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<MsalUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    const account = accounts && accounts.length > 0 ? accounts[0] : undefined;

    async function load() {
      setLoading(true);
      try {
        if (!account) {
          if (mounted) setUser(null);
          return;
        }

        // Acquire token silently for Graph
        const request = {
          account,
          scopes: graphRequest.scopes,
        };

        const resp = await instance.acquireTokenSilent(request);
        const accessToken = resp.accessToken;
        const profile = await callGraphApi(accessToken);

        if (mounted) {
          setUser({
            account,
            name: profile.displayName ?? account.name,
            email: profile.mail ?? profile.userPrincipalName ?? account.username,
            username: account.username,
            graphProfile: profile,
          });
        }
      } catch (err: any) {
        // si acquireTokenSilent échoue, on retourne au minimum les claims du compte
        if (account && mounted) {
          setUser({
            account,
            name: account.name ?? null,
            email: account.username ?? null,
            username: account.username ?? null,
            graphProfile: undefined,
          });
        }
        setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [accounts, instance]);

  return { user, loading, error };
}
