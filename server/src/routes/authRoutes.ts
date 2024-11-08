import express from 'express';
import { checkLoggedInStatus, loginController } from '../controllers/auth/loginController';
import { registerController } from '../controllers/auth/registerController';
import { logoutController } from '../controllers/auth/logoutController';
const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

router.get('/isLoggedIn', checkLoggedInStatus);

export default router;