<<<<<<< HEAD
import { Conversation, Message } from "../models";
=======
import Message from "../models/Message";
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715

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
