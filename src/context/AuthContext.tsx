import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { AccountInfo } from "@azure/msal-browser";
import { azureConfigured, msal, signIn, signOut } from "@/lib/azure";

type AuthContextValue = {
  account: AccountInfo | null;
  ready: boolean;
  configured: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await msal.initialize();
        let redirectAccount: AccountInfo | null = null;

        try {
          redirectAccount = (await msal.handleRedirectPromise())?.account || null;
        } catch (error) {
          // Popup sign-in can leave a stale redirect entry during local HMR.
          // It is safe to continue with the account already stored by MSAL.
          console.warn("No se pudo restaurar la redirección de inicio de sesión.", error);
        }

        const active = redirectAccount || msal.getActiveAccount() || msal.getAllAccounts()[0] || null;
        if (active) msal.setActiveAccount(active);
        if (mounted) setAccount(active);
      } catch (error) {
        console.error("No se pudo inicializar Microsoft Entra.", error);
      } finally {
        if (mounted) setReady(true);
      }
    };

    void initializeAuth();
    return () => { mounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    account,
    ready,
    configured: azureConfigured,
    login: async () => {
      const result = await signIn();
      msal.setActiveAccount(result.account);
      setAccount(result.account);
    },
    logout: async () => {
      await signOut(account || undefined);
      setAccount(null);
    },
  }), [account, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
