import { Conversation, Message } from "../models";

export default {
  async findAll(conversationId: number, limit: number | undefined = undefined) {
    return Message.findAll({
      where: {
        conversation_id: conversationId,
      },
      limit,
    });
  },
};
