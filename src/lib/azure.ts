import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
} from "@azure/msal-browser";

const tenantName = import.meta.env.VITE_AZURE_TENANT_NAME as string | undefined;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string | undefined;
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string | undefined;
const apiClientId = import.meta.env.VITE_AZURE_API_CLIENT_ID as string | undefined;

export const azureConfigured = Boolean(tenantName && clientId && apiClientId);
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";

const authority = tenantName
  ? `https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com`
  : "https://login.microsoftonline.com/common";
const knownAuthorities = tenantName
  ? [
      `${tenantName}.ciamlogin.com`,
      ...(tenantId ? [`${tenantId}.ciamlogin.com`] : []),
    ]
  : [];

export const msal = new PublicClientApplication({
  auth: {
    clientId: clientId || "00000000-0000-0000-0000-000000000000",
    authority,
    knownAuthorities,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: "localStorage" },
});

const scopes = apiClientId ? [`api://${apiClientId}/access_as_user`] : [];

export async function signIn(): Promise<AuthenticationResult> {
  if (!azureConfigured) throw new Error("Azure todavía no está configurado.");
  return msal.loginPopup({ scopes, prompt: "select_account" });
}

export async function signOut(account?: AccountInfo) {
  await msal.logoutPopup({ account });
}

export async function accessToken(account: AccountInfo): Promise<string> {
  try {
    return (await msal.acquireTokenSilent({ account, scopes })).accessToken;
  } catch {
    return (await msal.acquireTokenPopup({ account, scopes })).accessToken;
  }
}
