import Conversation from "../models/Conversation";

export default {
  async findOrCreateBySenderAndReceiverIds(
    senderId: number,
    receiverId: number
  ) {
    return Conversation.findOrCreate({
      where: {
        user_a: senderId,
        user_b: receiverId,
      },
    });
  },
  async findByChannelId(channelId: number) {
    return Conversation.findOne({
      where: {
        channelId: channelId,
      },
    });
  },
};
