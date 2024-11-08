import express from 'express';
import { getChatMessages, randomChat, sendChatMessage } from '../controllers/request/chatController';
import { Request, Response } from 'express';
const router = express.Router();

router.get('/random', randomChat);
router.post('/send', sendChatMessage);
router.post('/messages', getChatMessages);

router.get('/', (req: Request, res: Response) => {
    res.send('Chat routes')
return;

});

export default router;