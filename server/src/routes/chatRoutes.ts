import express from 'express';
import { getChatMessages, randomChat, sendChatMessage } from '../controllers/request/chatController';
const router = express.Router();

router.get('/random', randomChat);
router.post('/send', sendChatMessage);
router.post('/messages', getChatMessages);

router.get('/', (req, res) => {
    res.send('Chat routes');
    }
);

export default router;