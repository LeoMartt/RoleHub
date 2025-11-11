export interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  username?: string;
  avatarUrl?: string | null; 
  bio?: string | null;
}