import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';

const router = Router();

router.get('/users', UserController.getAll);

export default router;