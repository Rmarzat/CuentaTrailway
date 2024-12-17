export interface ExchangeRate {
  id?: string;
  date: string;
  currency: string;
  rate: number;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExchangeRateResponse {
  success?: boolean;
  data: ExchangeRate[];
  message?: string;
  warnings?: string[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  warnings?: string[];
}