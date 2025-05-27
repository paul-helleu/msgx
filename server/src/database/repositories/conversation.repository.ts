import { Conversation, UserConversation } from "../models";

export default {
  async findByChannelId(channelId: number) {
    return Conversation.findOne({
      where: {
        channel_id: channelId,
      },
    });
  },
  async findUserConversationByUserId(userId: number) {
    return UserConversation.findAll({
      where: {
        user_id: userId,
      },
    });
  },
};
