import jwt from 'jsonwebtoken';
import {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} from '../config/jwt.config';

export class JwtService {
  public static createAccessToken = (userId: string) =>
    jwt.sign({ sub: userId }, accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    });

  public static createRefreshToken = (userId: string) =>
    jwt.sign({ sub: userId }, refreshTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    });

  public static verifyAccessToken = (token: string) =>
    jwt.verify(token, accessTokenSecret) as jwt.JwtPayload;

  public static verifyRefreshToken = (token: string) =>
    jwt.verify(token, refreshTokenSecret) as jwt.JwtPayload;
}
