import { Router } from 'express';
import { ConversationController } from '../../controllers/conversation.controller';
import { isValidToken } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new ConversationController();

router.post(
  '/create',
  isValidToken,
  controller.createNewConversation.bind(controller)
);
router.get('/', isValidToken, controller.getUserConversation.bind(controller));

export default router;
