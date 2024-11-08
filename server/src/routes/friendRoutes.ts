import express from 'express';
import { acceptFriendRequest, fetchFriendRequests, fetchFriends, rejectFriendRequest, removeFriend, sendFriendRequest } from '../controllers/request/friendController';
const router = express.Router();

router.post("/send-friend-request", sendFriendRequest);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);
router.post("/remove-friend", removeFriend);

router.get('/friends', fetchFriends);
router.get('/friend-requests', fetchFriendRequests);

router.get('/', (req, res) => {
    res.send('Friend routes')
return;

    }
);

export default router;