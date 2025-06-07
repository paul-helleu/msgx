import { ConversationRepository } from '../repositories/conversation.repository';

export class ConversationService {
  private conversationRepository: ConversationRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
  }
}
