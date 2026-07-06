const API_ERROR_MESSAGES: Record<string, string> = {
  validation_failed: "Please check your input and try again.",
  conflict: "This action conflicts with existing data.",
  transition_not_allowed: "This state change is not allowed.",
  not_found: "The requested resource was not found.",
  invalid_request: "Invalid request. Please try again.",
  unauthorized: "Your session has expired. Please sign in again.",
  internal_error: "Something went wrong on our end. Please try again.",
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) {
    return API_ERROR_MESSAGES[error.code] ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getApiErrorCode(error: unknown): string | null {
  if (error instanceof ApiError) {
    return error.code;
  }

  return null;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}
