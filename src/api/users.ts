import { api } from "./client";
import type { User, UpdateUserPayload } from "../types";
import { convertImageToBase64, validateImageFile } from "../utils/imageCoverter";

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

export async function uploadAvatar(userId: number, file: File): Promise<User> {
  // valida e converte
  validateImageFile(file, 5); // limite de 5MB (ajuste se quiser)
  const avatarBase64 = await convertImageToBase64(file);

  // envia em JSON: { avatarBase64: "data:image/...;base64,..." }
  const { data } = await api.put<User>(`/users/${userId}/avatar`, { avatarBase64 });
  return data;
}

/** Remove avatar (DELETE /users/{id}/avatar) */
export async function removeAvatar(userId: number): Promise<User> {
  const { data } = await api.delete<User>(`/users/${userId}/avatar`);
  return data;
}