import type { Request, Response } from 'express';
import Conversation from '../models/Conversation.ts';

export default {
  async getAll(req: Request, res: Response) {
    const conversations = await Conversation.findAll();
    res.json(conversations);
  },
};
