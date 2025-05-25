import express from 'express';
import dotenv from 'dotenv';
import router from '../database/routes/index.ts';
import sequelize from '../database/sequelize.ts';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { compareSync, hashSync } from 'bcrypt-ts';
import { isValidToken, type AuthenticatedRequest } from './auth.ts';
import { Op } from 'sequelize';
import { UserConversation, Conversation, User, Message } from '../database/models/index.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

const app = express();
app.use(express.json());
app.use("/api", router);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/api/login", async (req, res) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      res.status(404).json({ message: "This username does not exist." });
    } else {
      const isValid = compareSync(password, existingUser.dataValues.password);
      if (!isValid) {
        res.status(403).json({ message: "Incorrect password" });
      }
      const token = jwt.sign({ id: existingUser.dataValues.id }, JWT_SECRET, {
        expiresIn: "3h",
      });
      res
        .status(200)
        .json({ message: "Authentification Succedeed", token: token });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      res.status(409).json({ message: "Registration error" });
    }

    await User.create({ username, password: hashSync(password, 10) });
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Endpoint starting with /api/auth need "authorization: token" in req headers 
app.get(
  "/api/auth/user",
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        const { id, username } = user.toJSON();
        res.json({ id, username });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

app.get(
  "/api/auth/valid_token",
  isValidToken,
  async (req: AuthenticatedRequest, res) => {
    res.status(200).json({ message: "Token Valid" });
  }
);

app.get('/api/auth/conversations', isValidToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const userConv = await UserConversation.findAll({
      where: { user_id: userId },
      attributes: ['conversation_id']
    });
    const conversations = await UserConversation.findAll({
      where: {
        conversation_id: {
          [Op.in]: userConv.map(c => c.get('conversation_id')),
        },
        user_id: {
          [Op.ne]: userId,
        },
      },
      include: [
        {model: User, attributes: ['id', 'username']},
        {model: Conversation, attributes: ['id', 'channel_id']},
      ],
      attributes: ['conversation_id']
    });
    res.json(conversations)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/messages/:conv_id', isValidToken, async (req: AuthenticatedRequest, res) => {
  try {
    const convId = req.params.conv_id;
    const messages = await Message.findAll({
      where: { conversation_id: convId },
      include: [
        {model: User, attributes: ['id', 'username'], as:"Sender"},
        {model: Conversation, attributes: ['id', 'channel_id']},
      ],
      attributes: ['createdAt', 'content'],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// Sync Sequelize
sequelize.sync().then(() => {
  console.log("Base de données synchronisée");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
