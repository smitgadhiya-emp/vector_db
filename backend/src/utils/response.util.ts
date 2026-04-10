import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  options: {
    data?: T;
    message?: string;
    statusCode?: number;
  } = {},
): Response {
  const { data, message, statusCode = 200 } = options;
  const body: { success: true; data?: T; message?: string } = { success: true };
  if (message !== undefined) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: Error | string,
  statusCode: number = 400,
): Response {
  return res.status(statusCode).json({ success: false, message });
}
