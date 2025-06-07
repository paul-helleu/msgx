import { Router } from 'express';
import { isValidToken } from '../../middlewares/auth.middleware';
import { UserController } from '../../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.get('/current', isValidToken, controller.getCurrent.bind(controller));
router.post('/', isValidToken, controller.searchUsers.bind(controller));

export default router;
