// src/hooks/useAuthFlag.ts
import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT } from "../api/auth";

export function useAuthFlag() {
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem("auth_token"));

  useEffect(() => {
    const update = () => setIsAuth(!!localStorage.getItem("auth_token"));
    window.addEventListener("storage", update);            // outras abas
    window.addEventListener(AUTH_CHANGED_EVENT, update);   // mesma aba
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(AUTH_CHANGED_EVENT, update);
    };
  }, []);

  return isAuth;
}
