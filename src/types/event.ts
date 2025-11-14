export interface Event {
  id: number;                   
  title: string;
  description: string;
  date: string;            
  time: string;                  
  location: string;
  category: string;
  imageUrl: string | null;
  interestedCount: number;
  organizer: {                  
    id: number;
    fullName: string;
  };
  full: boolean;
  createdAt: string;
  updatedAt: string;
  interestedByMe?: boolean;
}

export interface eventsLocalization {
  location: string;
}


export interface OrganizerRef {
  id: number;
  fullName: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
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

export interface eventsLocalization {
  location: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string | null;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;