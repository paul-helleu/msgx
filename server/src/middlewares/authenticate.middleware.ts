import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) return next();

  try {
    let decoded = jwt.decode(token) as jwt.JwtPayload;
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (decoded.sub && decoded.exp && decoded.exp < nowInSeconds) {
      const newToken = JwtService.createAccessToken(decoded.sub);
      // res.cookie('jwt', newToken, { httpOnly: true, secure: true });
      res.cookie('jwt', newToken);
      decoded = jwt.decode(newToken) as jwt.JwtPayload;
    }

    const user = await userService.getUserById(Number(decoded.sub));
    if (!user) throw new Error('User not found!');

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('jwt');
    next();
  }
};
