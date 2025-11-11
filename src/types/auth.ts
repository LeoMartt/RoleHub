// Login (POST /users/login)
export interface LoginPayload {
  email: string;
  password: string;
}

// Signup (POST /users)
export interface SignupPayload {
  fullName: string;
  email: string;
  username: string;  // pode ser derivado do e-mail no serviço, se faltar
  password: string;
}

// (Opcional) dados mínimos de usuário autenticado
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
}
