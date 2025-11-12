export type ErrorKey =
  | 'EVENTS_LOAD'
  | 'EVENTS_INTEREST'
  | 'EVENTS_CREATE'
  | 'IMAGE_UPLOAD'         
  | 'AUTH_LOGIN'
  | 'AUTH_SIGNUP'
  | 'NETWORK'
  | 'UNKNOWN';

export const errorMessages: Record<ErrorKey, string> = {
  EVENTS_LOAD: 'Não foi possível carregar os eventos.',
  EVENTS_INTEREST: 'Não foi possível registrar seu interesse.',
  EVENTS_CREATE: 'Não foi possível criar o evento.',
  IMAGE_UPLOAD: 'Não foi possível enviar a imagem. Tente novamente.', 
  AUTH_LOGIN: 'Falha ao entrar. Verifique suas credenciais.',
  AUTH_SIGNUP: 'Não foi possível criar sua conta.',
  NETWORK: 'Falha de conexão. Verifique sua internet.',
  UNKNOWN: 'Algo deu errado. Tente novamente.',
};
