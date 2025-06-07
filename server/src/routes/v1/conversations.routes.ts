import { Router } from 'express';
import { ConversationController } from '../../controllers/conversation.controller';
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated.middleware';

const router = Router();
const controller = new ConversationController();

router.post(
  '/create',
  ensureAuthenticated,
  controller.createNewConversation.bind(controller)
);
router.get(
  '/',
  ensureAuthenticated,
  controller.getUserConversation.bind(controller)
);

export default router;
