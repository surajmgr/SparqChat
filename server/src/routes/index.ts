import express from 'express';
import { homeController } from '../controllers/homeController.js';
const router = express.Router();

import auth_routes from './authRoutes.js';
import friend_routes from './friendRoutes.js';
import chat_routes from './chatRoutes.js';

router.get('/', homeController);
router.use('/auth', auth_routes);
router.use('/friend', friend_routes);
router.use('/chat', chat_routes);

export default router;
