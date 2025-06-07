import type { NextFunction, Request, Response } from 'express';

export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated!()) {
    return next();
  }
  res.status(401).json({ message: 'User not authenticated' });
};
