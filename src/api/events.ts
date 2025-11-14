import { api } from "./client";
import type { CreateEventPayload } from "../types";
import type { Event } from "../types/event";
import { convertImageToBase64 } from "../utils/imageCoverter";

export async function createEvent(payload: CreateEventPayload, organizerId: number): Promise<Event> {
  const { data } = await api.post<Event>(`/events?organizerId=${organizerId}`, payload);
  return data;
}

export async function listEvents(signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>("/events", { signal });
  return data;
}

export async function listEventsByOrganizer(organizerId: number, signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>(`/events/organizer/${organizerId}`, { signal });
  return Array.isArray(data) ? data : [];
}

export async function uploadEventImage(eventId: number, file: File): Promise<Event> {
  const imageBase64 = await convertImageToBase64(file);
  const { data } = await api.put<Event>(`/events/${eventId}/image`, { imageBase64 });
  return data;
}

export async function removeEventImage(eventId: number): Promise<Event> {
  const { data } = await api.delete<Event>(`/events/${eventId}/image`);
  return data;
}

export async function getEvent(id: number, signal?: AbortSignal): Promise<Event> {
  const { data } = await api.get<Event>(`/events/${id}`, { signal });
  return data;
}

export async function deleteEvent(eventId: number, requesterId: number): Promise<void> {
  await api.delete(`/events/${eventId}`, { params: { requesterId } });
}