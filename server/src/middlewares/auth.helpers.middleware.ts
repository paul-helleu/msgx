import type { NextFunction, Request, Response } from 'express';
import { JwtService } from '../services/jwt.service';

export const authHelpers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.isAuthenticated = () => !!req.user;

  req.login = (user) => {
    const token = JwtService.createAccessToken(user.id.toString());
    req.user = user;
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.cookie('jwt', token);
  };

  req.logout = () => {
    res.clearCookie('jwt');
  };

  next();
};
