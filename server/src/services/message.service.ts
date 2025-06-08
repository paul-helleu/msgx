import { logger } from '../config/logger.config';
import { MessageRepository } from '../repositories/message.repository';
import { ApiError } from '../utils/errors';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  public async getByConversationChannelId(channelId: string) {
    try {
      return await this.messageRepository.findAllByConversationChannelId(
        channelId
      );
    } catch (err) {
      logger.error(
        `getByConversationChannelId failed: ${channelId} - ${
          (err as Error).message
        }`
      );
      throw new ApiError(
        500,
        'Failed to retrieve conversation by channelId',
        'DB_FAILURE'
      );
    }
  }
}
