import express from 'express';
import { homeController } from '../controllers/homeController';
const router = express.Router();

import auth_routes from './authRoutes';
import friend_routes from './friendRoutes';
import chat_routes from './chatRoutes';

router.get('/', homeController);
router.use('/auth', auth_routes);
router.use('/friend', friend_routes);
router.use('/chat', chat_routes);

export default router;
