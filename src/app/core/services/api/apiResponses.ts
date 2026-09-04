import { throwError } from 'rxjs';

export function handleResponse<T>(response: any): T {
  if (response.status === 'success' || response.status === 'OK') {
    return response.data as T;
  }

  throw new Error(response.message || 'Respuesta inesperada del servidor');
}

export function handleError(operation = 'operación') {
  return (error: any) => {
    let message = `Error en ${operation}`;

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    return throwError(() => new Error(message));
  };
}