import { AxiosError } from 'axios';
import type { ApiError, ApiErrorResponse } from '@/lib/types/api';

export const handleApiError = (error: unknown, defaultMessage: string) => {
  console.error('API Error:', error);

  if ((error as ApiError)?.message) {
    throw new Error((error as ApiError).message);
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    throw new Error(data?.error || data?.message || defaultMessage);
  }

  if (error instanceof Error) {
    throw new Error(error.message || defaultMessage);
  }

  throw new Error(defaultMessage);
};