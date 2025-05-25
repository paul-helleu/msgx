import { Router } from "express";
import UserController from "../controllers/user.controller.ts";
import ConversationController from "../controllers/conversation.controller.ts";
import MessageController from "../controllers/message.controller.ts";
import User from "../models/User.ts";
import userRepository from "../repositories/user.repository.ts";
import conversationRepository from "../repositories/conversation.repository.ts";

const router = Router();

router.get("/users", UserController.getAll);
router.get("/conversations", ConversationController.getAll);

// router.get("/messages", MessageController.getAll);

router.get("/messages", (req, res, next) => {});

router.post("/conversations/:id/messages", async (req, res, next) => {
  const { id } = req.params;

  // const conversation = await conversationRepository

  // const user = await userRepository.findByUsername(senderUsername);
  // if (user === null) {
  //   res.status(400).json({
  //     message: "Invalid sender username",
  //     errors: {
  //       sender: {
  //         code: "",
  //         message: "",
  //       },
  //     },
  //   });
  // }
});

export default router;
