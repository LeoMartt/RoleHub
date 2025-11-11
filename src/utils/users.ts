// src/utils/users.ts
import { getUsers } from "../api/users";

/** Retorna a contagem de usuários a partir do GET /users */
export async function getUsersCount(signal?: AbortSignal): Promise<number> {
  const data = await getUsers(signal);
  return Array.isArray(data) ? data.length : 0;
}
