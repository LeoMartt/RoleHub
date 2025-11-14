// Login (POST /users/login)
export interface LoginPayload {
  email: string;
  password: string;
}

// Signup (POST /users)
export interface SignupPayload {
  fullName: string;
  email: string;
  username: string; 
  password: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
}
