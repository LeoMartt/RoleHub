import { api } from "./client";
import type { Event } from "../types/event";

/** toggle do botão “Quero ir” */
export async function toggleInterest(userId: number, eventId: number) {
  const { data } = await api.post<{ isInterested: boolean; message: string }>(
    "/interests/toggle",
    { userId, eventId }
  );
  return data;
}

/** (já estava usando no perfil) – lista eventos que o usuário participa */
export async function listInterestedEventsByUser(
  userId: number,
  signal?: AbortSignal
): Promise<Event[]> {
  const { data } = await api.get<Event[]>(
    `/interests/user/${userId}/events`,
    { signal }
  );
  // aceita tanto array cru quanto { events: [...] }
  if (Array.isArray(data)) return data;
  // @ts-ignore
  if (data?.events && Array.isArray(data.events)) return data.events;
  return [];
}
