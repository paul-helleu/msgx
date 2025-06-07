import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated.middleware';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.post('/register', controller.register.bind(controller));
router.get(
  '/valid_token',
  ensureAuthenticated,
  controller.verifyToken.bind(controller)
);

export default router;
