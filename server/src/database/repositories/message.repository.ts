import { Message } from "../models";

export default {
  async findAllByConversationId(
    conversationId: number,
    limit: number | undefined = undefined
  ) {
    return Message.findAll({
      where: {
        conversation_id: conversationId,
      },
      limit,
    });
  },
};
