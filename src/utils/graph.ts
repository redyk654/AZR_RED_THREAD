// src/utils/graph.ts
/**
 * Helpers pour appeler Microsoft Graph en utilisant un access token.
 * - getGraphUser: récupère /me (displayName, mail, userPrincipalName)
 */

export async function callGraphApi(accessToken: string, endpoint = "https://graph.microsoft.com/v1.0/me") {
  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph API error ${res.status}: ${text}`);
  }
  return res.json();
}
