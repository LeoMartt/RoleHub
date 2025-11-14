import { api, setAuthToken } from "./client";
import type { User } from "../types";

export const AUTH_CHANGED_EVENT = "auth:changed";

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { fullName: string; email: string; password: string; username?: string };

type AuthResponse = { token: string; user?: User; userInfo?: User };

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  const token = data.token;
  const user = (data.user ?? data.userInfo) as User | undefined;
  if (!token) throw new Error("Token não retornado pelo backend.");

  localStorage.setItem("auth_token", token);
  setAuthToken(token);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

  return { token, user };
}

export async function signup(payload: SignupPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
  }
  localStorage.removeItem("auth_token");
  setAuthToken(undefined);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
