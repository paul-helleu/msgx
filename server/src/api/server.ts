import express from 'express';
import router from '../database/routes/index.ts';
import sequelize from '../database/sequelize.ts';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { compareSync, hashSync } from 'bcrypt-ts';
import { isValidToken, type AuthenticatedRequest } from './auth.ts';
import { Op } from 'sequelize';
import {
  UserConversation,
  Conversation,
  User,
  Message,
} from '../database/models/index.ts';
import { getRandomTailwindColorClass } from '../utils/colors.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('/api', router);

app.post('/api/login', async (req, res) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      res.status(404).json({ message: 'This username does not exist.' });
    } else {
      const isValid = compareSync(password, existingUser.dataValues.password);
      if (!isValid) {
        res.status(403).json({ message: 'Incorrect password' });
      }
      const token = jwt.sign({ id: existingUser.dataValues.id }, JWT_SECRET, {
        expiresIn: '3h',
      });
      res
        .status(200)
        .json({ message: 'Authentification Succedeed', token: token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser !== null) {
    res.status(409).json({ message: 'Registration error' });
  }

  try {
    await User.create({
      username,
      password: hashSync(password, 10),
      color: getRandomTailwindColorClass(),
    });
    res.status(201).json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint starting with /api/auth need "authorization: token" in req headers
app.get(
  '/api/auth/user',
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        const { id, username, color } = user.toJSON();
        res.json({ id, username, color });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }
);

app.post(
  '/api/auth/users',
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { search } = req.body;
      console.log(req.user.id);

      const whereClause: any = {
        id: { [Op.ne]: userId },
      };
      if (search) {
        whereClause.username = {
          [Op.iLike]: `%${search}%`,
        };
      }

      const users = await User.findAll({
        where: whereClause,
        order: [['username', 'ASC']],
        limit: 10,
        attributes: ['id', 'username', 'color'],
      });

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server Error', error });
    }
  }
);

app.get(
  '/api/auth/valid_token',
  isValidToken,
  async (_: AuthenticatedRequest, res) => {
    res.status(200).json({ message: 'Token Valid' });
  }
);

app.get(
  '/api/auth/conversations',
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
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
);

app.get(
  '/api/auth/messages/:channel_id',
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
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
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Sync Sequelize
sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
});

const PORT = process.env.PORT || 3000;

// app.listen(PORT);
app.listen(3000, '0.0.0.0');
