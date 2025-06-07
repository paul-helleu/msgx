import { Conversation, UserConversation } from '../models';

export class ConversationRepository {
  public async findByChannelId(channelId: number) {
    try {
      const conversation = await Conversation.findOne({
        where: {
          channel_id: channelId,
        },
      });
      return conversation;
    } catch (error) {
      throw new Error('Error while retrieving conversation');
    }
  }

  public async findUserConversationByUserId(userId: number) {
    try {
      const conversation = await UserConversation.findAll({
        where: {
          user_id: userId,
        },
      });
      return conversation;
    } catch (error) {
      throw new Error('Error while retrieving conversation');
    }
  }
}
