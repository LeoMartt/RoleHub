import { api } from "./client";
import type { CreateEventPayload } from "../types";
import type { Event } from "../types/event";

/** POST /events?organizerId=ID */
export async function createEvent(payload: CreateEventPayload, organizerId: number) {
  const { data } = await api.post<Event>("/events", payload, {
    params: { organizerId },
  });
  return data;
}

export async function markInterested(id: number) {
  await api.post(`/events/${id}/interest`);
}

export async function listEvents(signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>("/events", { signal });
  return data;
}

export async function listEventsByOrganizer(
  organizerId: number,
  signal?: AbortSignal
): Promise<Event[]> {
  const { data } = await api.get<Event[]>(`/events/organizer/${organizerId}`, { signal });
  return Array.isArray(data) ? data : [];
}
