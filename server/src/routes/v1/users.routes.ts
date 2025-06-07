import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated.middleware';

const router = Router();
const controller = new UserController();

router.get(
  '/current',
  ensureAuthenticated,
  controller.getCurrent.bind(controller)
);
router.post('/', ensureAuthenticated, controller.searchUsers.bind(controller));

export default router;
