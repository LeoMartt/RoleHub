import { api } from "./client";
import type { CreateEventPayload } from "../types";
import type { Event } from "../types/event";
import { convertImageToBase64 } from "../utils/imageCoverter";

// POST /api/events?organizerId=X  -> retorna o Event criado
export async function createEvent(payload: CreateEventPayload, organizerId: number): Promise<Event> {
  const { data } = await api.post<Event>(`/events?organizerId=${organizerId}`, payload);
  return data;
}

// GET lista geral
export async function listEvents(signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>("/events", { signal });
  return data;
}

// GET por organizador
export async function listEventsByOrganizer(organizerId: number, signal?: AbortSignal): Promise<Event[]> {
  const { data } = await api.get<Event[]>(`/events/organizer/${organizerId}`, { signal });
  return Array.isArray(data) ? data : [];
}

// PUT /api/events/{id}/image (Base64)
export async function uploadEventImage(eventId: number, file: File): Promise<Event> {
  const imageBase64 = await convertImageToBase64(file);
  const { data } = await api.put<Event>(`/events/${eventId}/image`, { imageBase64 });
  return data;
}

// DELETE /api/events/{id}/image
export async function removeEventImage(eventId: number): Promise<Event> {
  const { data } = await api.delete<Event>(`/events/${eventId}/image`);
  return data;
}

export async function getEvent(id: number, signal?: AbortSignal): Promise<Event> {
  const { data } = await api.get<Event>(`/events/${id}`, { signal });
  return data;
}

// NOVO: deletar evento (envia requesterId como query param – validado no backend)
export async function deleteEvent(eventId: number, requesterId: number): Promise<void> {
  await api.delete(`/events/${eventId}`, { params: { requesterId } });
}