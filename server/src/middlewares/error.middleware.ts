import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/errors';
import { logger } from '../config/logger.config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      message: err.message,
      code: err.code,
    });
  } else {
    logger.warn(`${err.name}: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
