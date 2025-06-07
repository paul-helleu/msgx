import { User } from '../models';
import { AuthService } from '../services/auth.service';
import type { Request, Response } from 'express';
import { getRandomTailwindColorClass } from '../utils/colors';
import { UserService } from '../services/user.service';
import bcrypt from 'bcrypt';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  public async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await this.userService.getByUsername(username);
    if (!user || !(await bcrypt.compare(password, user!.password))) {
      res.status(401).json({ message: 'Invalid credentials!' });
      return;
    }

    req.login!(user);
    res.json({ message: 'Connection successfull' });
  }

  public logout(req: Request, res: Response) {
    req.logout!();
    res.json({ message: 'Disconnected' });
  }

  public async register(req: Request, res: Response) {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } }); // use finfOrCreate [created, user] => if created register else user already exit
    if (existingUser !== null) {
      res.status(409).json({ message: 'Registration error' });
    }

    try {
      await User.create({
        username,
        password: await bcrypt.hash(password, 12),
        color: getRandomTailwindColorClass(),
      });
      res.status(201).json({ message: 'success' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  public async verifyToken(_req: Request, res: Response) {
    res.status(200).json({ message: 'Token Valid' });
  }
}
