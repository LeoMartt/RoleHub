import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // proxy do Vite manda pro 8080
  // withCredentials: false  // NÃO usamos cookies
});

// define/limpa o Authorization global
export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// restaura token salvo ao iniciar o app (chame no main.tsx)
export function bootstrapAuth() {
  const token = localStorage.getItem("auth_token");
  if (token) setAuthToken(token);
  return token;
}
