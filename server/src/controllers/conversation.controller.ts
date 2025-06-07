import type { NextFunction, Response } from 'express';
import { Conversation, User, UserConversation } from '../models';
import { ConversationService } from '../services/conversation.service';
import type { AuthenticatedRequest } from '../api/auth';
import sequelize from '../database/sequelize';
import { Op } from 'sequelize';
import { UserService } from '../services/user.service';

const MAX_USER_PER_CONVERSATION =
  Number(process.env.MAX_USER_PER_CONVERSATION) || 10;

export class ConversationController {
  private conversationService: ConversationService;
  private userService: UserService;

  constructor() {
    this.conversationService = new ConversationService();
    this.userService = new UserService();
  }

  public async createNewConversation(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const senderId = req.user.id;
    const { recipients, name, color } = req.body;

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
      const recipient = await this.userService.findByUsername(
        recipientUsername
      );
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
        res.status(202).json({
          message: 'Conversation already exists',
          conversation: matchingConversation,
        });
        return;
      }
    }

    const groupName = name ? name.toString() : 'Nouvelle Conversation';
    const groupColor = color ? color : 'bg-emerald-500';
    const isGroup = recipientUsers.length > 1;

    const transaction = await sequelize.transaction();
    try {
      const newConversation = await Conversation.create(
        {
          channel_id: crypto.randomUUID(),
          name: isGroup ? groupName : '',
          color: groupColor,
          is_group: isGroup,
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

      const usersDto = recipientUsers.map((user) => ({
        id: user.id,
        username: user.username,
        color: user.color,
      }));
      const memberCount = usersDto.length + 1;

      res.status(201).json({
        conversation: {
          conversation: {
            ...newConversation.toJSON(),
            members_count: memberCount,
            Users: usersDto,
          },
        },
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  public async getUserConversation(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;

      // Récupère les conversations de l'utilisateur
      const userConversations = await UserConversation.findAll({
        where: { user_id: userId },
        attributes: ['conversation_id'],
        raw: true,
      });

      const conversationIds = userConversations.map((uc) => uc.conversation_id);

      const conversations = await Conversation.findAll({
        where: { id: { [Op.in]: conversationIds } },
        include: [
          {
            model: User,
            through: { attributes: [] }, // Exclut UserConversation
            attributes: ['id', 'username', 'color'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
      const result = conversations.map((conversation) => {
        const users = conversation.Users || [];
        const isGroup = conversation.is_group;

        if (!isGroup) {
          const otherUser = users.find((user) => user.id !== userId);
          return {
            id: conversation.id,
            is_group: false,
            channel_id: conversation.channel_id,
            name: otherUser?.username,
            color: otherUser?.color,
            Users: otherUser
              ? [
                  {
                    id: otherUser.id,
                    username: otherUser.username,
                    color: otherUser.color,
                  },
                ]
              : [],
          };
        } else {
          return {
            id: conversation.id,
            is_group: true,
            color: conversation.color,
            name: conversation.name,
            channel_id: conversation.channel_id,
            members_count: users.length,
            Users: users.filter((user) => user.id !== userId),
          };
        }
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
