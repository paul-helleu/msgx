import { compareSync, hashSync } from 'bcrypt-ts';
import { User } from '../models';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { getRandomTailwindColorClass } from '../utils/colors';
import type { AuthenticatedRequest } from '../api/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(req: Request, res: Response) {
    try {
      const { username, password }: { username: string; password: string } =
        req.body;
      const existingUser = await User.findOne({ where: { username } });
      if (!existingUser) {
        res.status(404).json({ message: 'This username does not exist.' });
      } else {
        const isValid = compareSync(password, existingUser.dataValues.password);
        if (!isValid) {
          res.status(403).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign({ id: existingUser.dataValues.id }, JWT_SECRET, {
          expiresIn: '3h',
        });
        res
          .status(200)
          .json({ message: 'Authentification Succedeed', token: token });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  public async register(req: Request, res: Response) {
    const { username, password }: { username: string; password: string } =
      req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser !== null) {
      res.status(409).json({ message: 'Registration error' });
    }

    try {
      await User.create({
        username,
        password: hashSync(password, 10),
        color: getRandomTailwindColorClass(),
      });
      res.status(201).json({ message: 'success' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  public async verifyToken(_req: AuthenticatedRequest, res: Response) {
    res.status(200).json({ message: 'Token Valid' });
  }
}
