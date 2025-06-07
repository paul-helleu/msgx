import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { isValidToken } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/register', controller.register.bind(controller));
router.get(
  '/valid_token',
  isValidToken,
  controller.verifyToken.bind(controller)
);

export default router;
