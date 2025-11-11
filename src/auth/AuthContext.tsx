import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { User } from "../types";
import { AUTH_CHANGED_EVENT } from "../api/auth";
import { bootstrapAuth } from "../api/client";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: User | null) => void;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    try {
      const token = bootstrapAuth(); // restaura token + seta Authorization
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await api.get("/auth/me");
      const u: User = data?.userInfo ?? data?.user ?? data ?? null;
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await hydrate();
      setLoading(false);
    })();

    const onAuthChanged = () => {
      setLoading(true);
      hydrate().finally(() => setLoading(false));
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
  }, []);

  const value = useMemo(
    () => ({ user, loading, refresh: hydrate, setUser }),
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
