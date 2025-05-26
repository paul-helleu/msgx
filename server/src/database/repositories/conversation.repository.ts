import { Conversation } from "../models";

export default {
  async findOrCreateBySenderAndReceiverIds(
    senderId: number,
    receiverId: number
  ) {
    return Conversation.findOrCreate({
      where: {},
    });
  },
  async findByChannelId(channelId: number) {
    return Conversation.findOne({
      where: {},
    });
  },
};
