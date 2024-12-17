export interface ExcelData {
  Moneda: string;
  Fecha: string | number;
  TipoCambio: string | number;
}

export interface ValidationError {
  row: number;
  message: string;
}