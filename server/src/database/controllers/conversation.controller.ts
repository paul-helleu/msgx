import type { Request, Response } from "express";
import { Conversation } from "../models/index";

export default {
  async getAll(_req: Request, res: Response) {
    const conversations = await Conversation.findAll();
    res.json(conversations);
  },
};
