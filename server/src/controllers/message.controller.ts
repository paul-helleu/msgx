import type { Request, Response } from 'express';
import { Conversation, Message, User } from '../models';
import { MessageService } from '../services/message.service';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public async create(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const { content } = req.body;
      const senderId = req.user?.id as number;

      if (!channelId || channelId.trim().length === 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: {
            channel_id: {
              code: 'REQUIRED_FIELD',
              message: 'Channel ID is required',
            },
          },
        });
        return;
      }

      if (!content || content.trim().length === 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: {
            content: {
              code: 'REQUIRED_FIELD',
              message: 'Message content is required and cannot be empty',
            },
          },
        });
        return;
      }

      const conversation = await Conversation.findOne({
        where: {
          channel_id: channelId.trim(),
        },
      });

      if (!conversation) {
        res.status(404).json({
          message: 'Channel not found',
          errors: {
            channelId: {
              code: 'NOT_FOUND',
              message: 'No conversation found for this channel ID',
            },
          },
        });
        return;
      }

      const message = await Message.create({
        conversation_id: conversation.id,
        sender_id: senderId,
        content: content.trim(),
      });

      conversation.changed('updatedAt', true);
      await conversation.save();

      res.status(201).json({
        message: 'Message sent successfully',
        data: {
          id: message.id,
          conversationId: message.conversation_id,
          channelId: conversation.channel_id,
          senderId: message.sender_id,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },
      });
    } catch (err) {
      res.status(500).json({ status: 'Internal server error' });
    }
  }

  public async getConversationMessages(req: Request, res: Response) {
    try {
      const channelId = req.params.channel_id;
      const messages = await Message.findAll({
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
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
