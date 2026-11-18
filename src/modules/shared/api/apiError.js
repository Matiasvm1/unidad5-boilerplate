// Uniform error shape for every failed HTTP call. Hooks and components only
// ever see an ApiError, never an Axios error.
const NETWORK_ERROR = 'NETWORK_ERROR';
const UNEXPECTED_MESSAGE = 'Ocurrió un error inesperado. Intentá nuevamente';

// The backend message is already user-facing Spanish, so it is shown as is.
// Only these statuses get a front-end text of their own.
const ownMessages = {
  429: 'Demasiadas solicitudes. Intentá de nuevo en un minuto',
  500: UNEXPECTED_MESSAGE,
};

class ApiError extends Error {
  constructor({ status, errorCode, message, details = [] }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }

  static fromAxiosError(error) {
    const { response } = error;

    if (!response) {
      return new ApiError({
        status: 0,
        errorCode: NETWORK_ERROR,
        message: 'No se pudo conectar con el servidor',
      });
    }

    const { status } = response;
    const body = response.data ?? {};

    return new ApiError({
      status,
      errorCode: body.errorCode ?? 'UNKNOWN_ERROR',
      message: ownMessages[status] ?? body.message ?? UNEXPECTED_MESSAGE,
      details: Array.isArray(body.details) ? body.details : [],
    });
  }
}

export { ApiError, NETWORK_ERROR };
