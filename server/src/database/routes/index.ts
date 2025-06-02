import { Router } from 'express';
import Message from '../models/Message.ts';
import Conversation from '../models/Conversation.ts';
import { isValidToken, type AuthenticatedRequest } from '../../api/auth.ts';
import { UserConversation } from '../models';
import userRepository from '../repositories/user.repository.ts';
import sequelize from '../sequelize.ts';
import { literal, Op } from 'sequelize';

const MAX_USER_PER_CONVERSATION =
  Number(process.env.MAX_USER_PER_CONVERSATION) || 10;

const router = Router();

router.post(
  '/messages/:channelId',
  isValidToken,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { channelId } = req.params;
      const { content } = req.body;
      const senderId = req.user.id;

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
        sender_id: parseInt(senderId, 10),
        content: content.trim(),
      });

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
);

router.post(
  '/conversations/create',
  isValidToken,
  async (req: AuthenticatedRequest, res, next) => {
    const senderId = req.user.id;
    const { recipients } = req.body;

    if (!recipients || !Array.isArray(recipients)) {
      res.status(400).json({
        message: 'Recipients must be an array',
        errors: {
          recipients: { code: 'INVALID_TYPE', message: 'Expected array' },
        },
      });
      return;
    }

    if (recipients.length > MAX_USER_PER_CONVERSATION) {
      res.status(400).json({
        message: `Impossible to add more than ${MAX_USER_PER_CONVERSATION} user per conversation`,
        errors: {
          sender: {
            code: '',
            message: '',
          },
        },
      });
      return;
    }

    if (recipients.length === 0) {
      res.status(400).json({
        message: 'At least one recipient is required',
        errors: {
          recipients: {
            code: 'EMPTY_ARRAY',
            message: 'No recipients provided',
          },
        },
      });
      return;
    }

    const uniqueRecipients = [...new Set(recipients)];
    if (uniqueRecipients.length !== recipients.length) {
      res.status(400).json({
        message: 'Duplicate recipients found',
        errors: {
          recipients: {
            code: 'DUPLICATES',
            message: 'Recipients must be unique',
          },
        },
      });
      return;
    }

    const recipientUsers = [];
    for (const recipientUsername of recipients) {
      const recipient = await userRepository.findByUsername(recipientUsername);
      if (!recipient) {
        res.status(400).json({
          message: `No user ${recipientUsername} found!`,
          errors: { sender: { code: '', message: '' } },
        });
        return;
      }

      if (recipient.id === senderId) {
        res.status(400).json({
          message: 'You cannot create a conversation with yourself',
          errors: { sender: { code: '', message: '' } },
        });
        return;
      }

      recipientUsers.push(recipient);
    }

    if (recipientUsers.length === 1) {
      const recipient = recipientUsers[0];

      const conversations = await Conversation.findAll({
        where: { is_group: false },
        include: [
          {
            association: 'Users',
            where: {
              id: [senderId, recipient.id],
            },
            required: true,
            through: {
              attributes: [],
            },
          },
        ],
      });

      const matchingConversation = conversations.find(
        (conv) => conv.Users && conv.Users.length === 2
      );

      if (matchingConversation) {
        res.status(200).json({
          message: 'Conversation already exists',
          conversation: matchingConversation,
        });
        return;
      }
    }

    const transaction = await sequelize.transaction();
    try {
      const newConversation = await Conversation.create(
        {
          channel_id: crypto.randomUUID(),
          name: recipients.length > 1 ? 'New Group' : '',
          is_group: recipients.length > 1,
        },
        { transaction }
      );

      const userConversations = [
        { conversation_id: newConversation.id, user_id: senderId },
        ...recipientUsers.map((user) => ({
          conversation_id: newConversation.id,
          user_id: user.id,
        })),
      ];

      await UserConversation.bulkCreate(userConversations, { transaction });
      await transaction.commit();

      res.status(201).json({ conversation: newConversation });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
);

export default router;
