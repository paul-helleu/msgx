import { Router } from 'express';
import { MessageController } from '../../controllers/message.controller';
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated.middleware';

const router = Router();
const controller = new MessageController();

router.post(
  '/:channelId',
  ensureAuthenticated,
  controller.create.bind(controller)
);
router.get(
  '/:channel_id',
  ensureAuthenticated,
  controller.getConversationMessages.bind(controller)
);

export default router;
