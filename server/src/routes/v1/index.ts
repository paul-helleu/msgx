import { Router } from 'express';
import conversationRoutes from './conversations.routes';
import messageRoutes from './messages.routes';
import userRoutes from './users.routes';
import authRoutes from './auth.route';

const router = Router();

router.use('/conversations', conversationRoutes);
router.use('/messages', messageRoutes);
router.use('/users', userRoutes);
router.use('/', authRoutes); // TODO: change to auth

export default router;
