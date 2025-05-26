<<<<<<< HEAD
import { Conversation } from "../models";
=======
import Conversation from "../models/Conversation";
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715

export default {
  async findOrCreateBySenderAndReceiverIds(
    senderId: number,
    receiverId: number
  ) {
    return Conversation.findOrCreate({
<<<<<<< HEAD
      where: {},
=======
      where: {
        user_a: senderId,
        user_b: receiverId,
      },
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
    });
  },
  async findByChannelId(channelId: number) {
    return Conversation.findOne({
<<<<<<< HEAD
      where: {},
=======
      where: {
        channelId: channelId,
      },
>>>>>>> 0ed518c0d7ed3533a281385c21847b1604254715
    });
  },
};
