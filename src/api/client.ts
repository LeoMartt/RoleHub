import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export function bootstrapAuth() {
  const token = localStorage.getItem("auth_token");
  if (token) setAuthToken(token);
  return token;
}
