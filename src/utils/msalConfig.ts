// src/utils/msalConfig.ts
/**
 * Configuration MSAL et instance partagée pour l'app.
 *
 * Remplace les placeholders ci-dessous par les valeurs de ton app Azure AD.
 * - CLIENT_ID : Application (client) ID
 * - TENANT_ID : Directory (tenant) ID
 * - REDIRECT_URI : doit être déclaré dans l'enregistrement de l'app (ex: http://localhost:3000)
 *
 * Scopes :
 * - openid / profile / offline_access (utiles pour auth)
 * - User.Read (Microsoft Graph, lecture profil)
 * - API scopes (ex: api://{backend-client-id}/access_as_user) si tu as un backend sécurisé
 */

import { PublicClientApplication, Configuration, SilentRequest, PopupRequest } from "@azure/msal-browser";

const CLIENT_ID = process.env.NEXT_PUBLIC_MSAL_CLIENT_ID || "<YOUR_CLIENT_ID>";
const TENANT_ID = process.env.NEXT_PUBLIC_MSAL_TENANT_ID || "<YOUR_TENANT_ID>";
const REDIRECT_URI = process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

// Authority = tenant-specific endpoint
const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI,
    // postLogoutRedirectUri can be set similarly if needed
  },
  cache: {
    cacheLocation: "sessionStorage", // sessionStorage is preferred for SPAs to avoid cross-tab leaks
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        // console.debug(`[MSAL ${level}] ${message}`);
      },
      piiLoggingEnabled: false,
    },
  },
};

// Scopes / requests
// - loginRequest used at login time
export const loginRequest: PopupRequest | SilentRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

// Scopes used to acquire an access token for Graph or your API
export const graphRequest = {
  scopes: ["User.Read"],
};

// If you have backend scopes, add them e.g.
// export const apiRequest = { scopes: ["api://<YOUR_API_CLIENT_ID>/access_as_user"] };

export const msalInstance = new PublicClientApplication(msalConfig);