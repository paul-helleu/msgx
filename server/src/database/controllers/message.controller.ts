import type { Request, Response } from 'express';
import Message from '../models/Message.ts';

export default {
  async getAll(req: Request, res: Response) {
    const messages = await Message.findAll();
    res.json(messages);
  },
};
