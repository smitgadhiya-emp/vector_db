import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  sendError(res, `Route not found: ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.statusCode || 500;
  sendError(res, err.message || 'Internal Server Error', status);
};
