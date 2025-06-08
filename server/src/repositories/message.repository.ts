import { Conversation, Message, User } from '../models';

export class MessageRepository {
  public findAllByConversationId(
    conversationId: number,
    limit: number | undefined = undefined
  ) {
    return Message.findAll({
      where: {
        conversation_id: conversationId,
      },
      limit,
    });
  }

  public findAllByConversationChannelId(channelId: string) {
    return Message.findAll({
      include: [
        {
          model: Conversation,
          attributes: ['id', 'channel_id'],
          where: { channel_id: channelId },
        },
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'username', 'color'],
        },
      ],
      attributes: ['createdAt', 'content'],
      order: [['createdAt', 'ASC']],
    });
  }
}
