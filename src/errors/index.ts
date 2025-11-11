import type { AxiosError } from 'axios';
import { errorMessages, type ErrorKey } from './messages';

function isAxiosError(e: unknown): e is AxiosError {
  return typeof e === 'object' && e !== null && (e as any).isAxiosError === true;
}

export function getErrorMessage(key: ErrorKey, err?: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) return errorMessages.NETWORK;
    const { status } = err.response;

    if (key === 'AUTH_LOGIN') {
      if (status === 401) return 'E-mail ou senha incorretos.';
      if (status === 403) return 'Acesso negado.';
    }
    if (key === 'AUTH_SIGNUP') {
      if (status === 409) return 'E-mail ou usuário já cadastrados.';
      if (status === 400) return 'Dados inválidos. Revise os campos.';
    }
    if (status >= 500) return 'Servidor indisponível. Tente novamente.';
  }
  return errorMessages[key] ?? errorMessages.UNKNOWN;
}
