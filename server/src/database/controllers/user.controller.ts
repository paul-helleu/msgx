import type { Request, Response } from 'express';
import User from '../models/User.ts';

export default {
  async getAll(req: Request, res: Response) {
    const users = await User.findAll();
    res.json(users);
  },
};
