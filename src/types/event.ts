export interface Event {
  id: number;                    // back manda number
  title: string;
  description: string;
  date: string;                  // "YYYY-MM-DD"
  time: string;                  // "HH:mm:ss" ou "HH:mm"
  location: string;
  category: string;
  imageUrl: string | null;
  interestedCount: number;
  organizer: {                   // só o que precisa do organizer
    id: number;
    fullName: string;
  };
  full: boolean;
  createdAt: string;
  updatedAt: string;
  interestedByMe?: boolean;
}
// OBS: o back pode mandar campos a mais (email, password, etc.).
// Como esse type é um SUBCONJUNTO, você ignora o resto sem mapear.

export interface eventsLocalization {
  location: string;
}


export interface OrganizerRef {
  id: number;
  fullName: string;
}

// Modelo usado no front (subconjunto do payload do back)
export interface Event {
  id: number;
  title: string;
  description: string;

  /** Data no formato ISO "YYYY-MM-DD" (vem do back assim) */
  date: string;

  /**
   * Hora como "HH:mm" (UI) — o back pode mandar/esperar "HH:mm:ss".
   * Quando enviar, converta para "HH:mm:ss" (ex.: utils/datetime.timeToBackend).
   */
  time: string;

  location: string;
  category: string;
  imageUrl: string | null;

  interestedCount: number;
  maxParticipants: number | null;
  full: boolean;

  organizer: OrganizerRef;

  createdAt: string;
  updatedAt: string;
}

// (Como você pediu com esse nome específico para o filtro)
export interface eventsLocalization {
  location: string;
}
// Se quiser um nome em PascalCase também:
// export type EventLocalization = eventsLocalization;

// ===== Payloads para requisições (envio ao backend) =====

// Criar evento (POST /events)
export interface CreateEventPayload {
  title: string;
  description: string;
  /** ISO "YYYY-MM-DD" */
  date: string;
  /** "HH:mm:ss" */
  time: string;
  location: string;
  category: string;
  imageUrl?: string | null;
}

// Atualizar evento (PATCH/PUT /events/:id)
export type UpdateEventPayload = Partial<CreateEventPayload>;