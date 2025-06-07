import { Message } from '../models';

export class MessageRepository {
  public async findAllByConversationId(
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
}
