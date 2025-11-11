import { api } from "./client";
import type { User, UpdateUserPayload } from "../types";

export async function getUsers(signal?: AbortSignal) {
  const { data } = await api.get<User[]>("/users", { signal });
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return (data.user ?? data) as User; // backend pode devolver {user:{...}} ou direto o objeto
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
}

/** POST /users/{id}/avatar (multipart/form-data) -> User atualizado (avatarUrl novo) */
export async function uploadAvatar(userId: number, file: File): Promise<User> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post<User>(`/users/${userId}/avatar`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}