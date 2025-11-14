import { getUsers } from "../api/users";

export async function getUsersCount(signal?: AbortSignal): Promise<number> {
  const data = await getUsers(signal);
  return Array.isArray(data) ? data.length : 0;
}
