import express from 'express';
import { homeController } from '../controllers/homeController';
const router = express.Router();

import auth_routes from './authRoutes';

router.get('/', homeController);
router.use('/auth', auth_routes);

export default router;
