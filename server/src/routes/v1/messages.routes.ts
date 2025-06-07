import { Router } from 'express';
import { isValidToken } from '../../middlewares/auth.middleware';
import { MessageController } from '../../controllers/message.controller';

const router = Router();
const controller = new MessageController();

router.post('/:channelId', isValidToken, controller.create.bind(controller));
router.get(
  '/:channel_id',
  isValidToken,
  controller.getConversationMessages.bind(controller)
);

export default router;
