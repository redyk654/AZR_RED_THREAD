// src/redux/config.tsx
/**
 * Setup Axios interceptor that uses MSAL to acquire a token before requests.
 * - msalInstance: instance exportée depuis msalConfig
 * - request.call will acquire token silently for the requested scopes
 *
 * Usage:
 *   import { setupAxiosInterceptor } from "@/redux/config";
 *   setupAxiosInterceptor(msalInstance, ["api://<YOUR_API_CLIENT_ID>/access_as_user"]);
 */

import axios, { AxiosRequestConfig } from "axios";
import type { PublicClientApplication, AccountInfo } from "@azure/msal-browser";

export function setupAxiosInterceptor(msalInstance: PublicClientApplication, scopes: string[] = ["User.Read"]) {
  axios.interceptors.request.use(
    async (config) => {
      try {
        const accounts = msalInstance.getAllAccounts();
        const account: AccountInfo | undefined = accounts && accounts.length > 0 ? accounts[0] : undefined;

        if (account) {
          const response = await msalInstance.acquireTokenSilent({
            account,
            scopes,
          } as any);
          const token = response.accessToken;
          if (config && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
          } else if (config) {
            config.headers = { Authorization: `Bearer ${token}` } as any;
          }
        }
      } catch (err) {
        // silent token acquisition may fail (interaction required) — don't block the request,
        // let the API return 401 and handle it upstream or initiate interactive login.
        console.warn("MSAL: acquireTokenSilent failed for interceptor:", err);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}
