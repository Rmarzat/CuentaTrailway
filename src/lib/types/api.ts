export interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name
    };
  }
}