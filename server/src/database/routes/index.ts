import { Router } from "express";
import UserController from "../controllers/user.controller.ts";
import ConversationController from "../controllers/conversation.controller.ts";
import MessageController from "../controllers/message.controller.ts";
import userRepository from "../repositories/user.repository.ts";
import conversationRepository from "../repositories/conversation.repository.ts";

const MAX_USER_PER_CONVERSATION =
  Number(process.env.MAX_USER_PER_CONVERSATION) || 10;

const router = Router();

router.get("/users", UserController.getAll);
router.get("/conversations", ConversationController.getAll);

// router.get("/messages", MessageController.getAll);

router.get("/messages", (req, res, next) => {
  const limit = req.query?.limit;
  if (limit === null) {
    res.status(200).json();
  }
});

router.post("/users/@me/channels", (req, res, next) => {
  // check authentification

  const recipients: [] | null = req.body?.recipients;
  if (
    recipients === null ||
    !Array.isArray(recipients) ||
    recipients.length > MAX_USER_PER_CONVERSATION
  ) {
    res.status(400).json({
      message: "No recipients found",
      errors: {
        sender: {
          code: "",
          message: "",
        },
      },
    });
    return;
  }

  recipients.forEach((recipientId) => {
    if (!Number.isInteger(recipientId)) {
      res.status(400).json({
        message: "Recipients must contains recipientIds",
        errors: {
          sender: {
            code: "",
            message: "",
          },
        },
      });
      return;
    }
  });
});

router.post("/conversations/:channelId/messages", async (req, res, next) => {
  // check authentification

  const channelId = parseInt(req.params.channelId, 10);
  if (Number.isNaN(channelId)) {
    res.status(400).json({
      message: "Invalid Id must be an integer",
      errors: {
        sender: {
          code: "",
          message: "",
        },
      },
    });
    return;
  }

  const content: string | null = req.body?.content;
  if (content === null || content.length === 0) {
    res.status(400).json({
      message: "Message must contains content",
      errors: {
        sender: {
          code: "",
          message: "",
        },
      },
    });
    return;
  }

  const conversation = await conversationRepository.findByChannelId(channelId);
  if (conversation === null) {
    res.status(400).json({
      message: "No conversation found, need to create the conversation",
      errors: {
        sender: {
          code: "",
          message: "",
        },
      },
    });
    return;
  }

  // create message and link it to the conversation
});

export default router;
