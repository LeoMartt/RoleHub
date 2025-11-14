import { api } from "./client";
import type { Event } from "../types/event";
import type { User } from "../types";

export async function listInterestedEventsByUser(userId: number, signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>(`/interests/user/${userId}/events`, { signal });
  return Array.isArray(data) ? data : [];
}

export async function toggleInterest(userId: number, eventId: number): Promise<{isInterested: boolean}> {
  const { data } = await api.post<{isInterested: boolean}>("/interests/toggle", { userId, eventId });
  return data;
}

export async function checkUserInterested(userId: number, eventId: number, signal?: AbortSignal): Promise<boolean> {
  const { data } = await api.get<boolean>(`/interests/check?userId=${userId}&eventId=${eventId}`, { signal });
  return !!data;
}

export async function listInterestedUsers(eventId: number, signal?: AbortSignal): Promise<User[]> {
  const { data } = await api.get<User[]>(`/interests/event/${eventId}/users`, { signal });
  return Array.isArray(data) ? data : [];
}

export async function getInterestedCount(eventId: number, signal?: AbortSignal): Promise<number> {
  const { data } = await api.get<number>(`/interests/event/${eventId}/count`, { signal });
  return Number(data ?? 0);
}
