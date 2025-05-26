import type { Request, Response } from "express";
<<<<<<< HEAD
import { Conversation } from "../models/index";
=======
import Conversation from "../models/Conversation.ts";
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715

export default {
  async getAll(_req: Request, res: Response) {
    const conversations = await Conversation.findAll();
    res.json(conversations);
  },
};
