import express from 'express';
import { checkLoggedInStatus, loginController } from '../controllers/auth/loginController.js';
import { registerController } from '../controllers/auth/registerController.js';
import { logoutController } from '../controllers/auth/logoutController.js';
const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

router.get('/isLoggedIn', checkLoggedInStatus);

export default router;