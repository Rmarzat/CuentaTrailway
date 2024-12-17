import { Request, Response, NextFunction } from 'express';
import config from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Server Error:', err);

  res.status(500).json({
    error: err.message || 'Error interno del servidor',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.originalUrl}`
  });
};