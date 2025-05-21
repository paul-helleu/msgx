import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';
import ConversationController from '../controllers/conversation.controller.ts';
import MessageController from '../controllers/message.controller.ts';

const router = Router();

router.get('/users', UserController.getAll);
router.get('/conversations', ConversationController.getAll);
router.get('/messages', MessageController.getAll);

export default router;