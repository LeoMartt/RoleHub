import { api } from "./client";
import type { User, UpdateUserPayload } from "../types";
import { convertImageToBase64, validateImageFile } from "../utils/imageCoverter";

export async function getUsers(signal?: AbortSignal) {
  const { data } = await api.get<User[]>("/users", { signal });
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return (data.user ?? data) as User;
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
}

export async function uploadAvatar(userId: number, file: File): Promise<User> {
  validateImageFile(file, 50); 
  const avatarBase64 = await convertImageToBase64(file);

  const { data } = await api.put<User>(`/users/${userId}/avatar`, { avatarBase64 });
  return data;
}

export async function removeAvatar(userId: number): Promise<User> {
  const { data } = await api.delete<User>(`/users/${userId}/avatar`);
  return data;
}