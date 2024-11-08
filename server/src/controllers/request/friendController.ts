import { Request, Response } from "express";
import { prisma } from "../../db/queryHandler";
import { redisClient } from "../../utils/redis";
import { io } from "../../server";

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const { recipientId } = req.body;
        const requesterId = req.session.user.id;

        if (!recipientId) {
            res.status(400).json({ message: "Recipient ID is required." })
return;

        }
        
        const existingRequest = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId, recipientId },
                    { requesterId: recipientId, recipientId: requesterId }
                ]
            }
        });

        if (existingRequest) {
            res.status(400).json({ message: "Friend request already exists." })
return;

        }
        
        await prisma.friendship.create({
            data: {
                requesterId,
                recipientId,
                status: "pending"
            }
        });

        await redisClient.sadd(`user:${recipientId}:friend_requests`, requesterId);
        
        const recipientSocketId = await redisClient.hget(`user:${recipientId}`, "socketId");
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("friend_request", { id: requesterId, name: req.session.user.email.split('@')[0], img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' });
        }

        res.json({ message: "Friend request sent." })
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while sending the friend request." })
return;

    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const { requesterId } = req.body;
        const recipientId = req.session.user.id;
        
        const exists = await redisClient.sismember(`user:${recipientId}:friend_requests`, requesterId);
        if (!exists) {
            res.status(400).json({ message: "No friend request found." })
return;

        }
        
        await prisma.friendship.updateMany({
            where: { requesterId, recipientId, status: "pending" },
            data: { status: "accepted" }
        });
        
        await redisClient.srem(`user:${recipientId}:friend_requests`, requesterId);
        await redisClient.sadd(`user:${recipientId}:friends`, requesterId);
        await redisClient.sadd(`user:${requesterId}:friends`, recipientId);
        
        const requesterSocketId = await redisClient.hget(`user:${requesterId}`, "socketId");
        if (requesterSocketId) {
            io.to(requesterSocketId).emit("friend_request_accepted", { id: recipientId, name: req.session.user.email.split('@')[0], img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' });
        }

        res.json({ message: "Friend request accepted.", online: requesterSocketId ? true : false })
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while accepting the friend request." })
return;

    }
};

export const removeFriend = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const { friendId } = req.body;
        const userId = req.session.user.id;
        
        await prisma.friendship.deleteMany({
            where: {
                OR: [
                    { requesterId: userId, recipientId: friendId, status: "accepted" },
                    { requesterId: friendId, recipientId: userId, status: "accepted" }
                ]
            }
        });
        
        await redisClient.srem(`user:${userId}:friends`, friendId);
        await redisClient.srem(`user:${friendId}:friends`, userId);
        
        const friendSocketId = await redisClient.hget(`user:${friendId}`, "socketId");
        if (friendSocketId) {
            io.to(friendSocketId).emit("friend_removed", { friendId: userId });
        }

        res.json({ message: "Friend removed successfully." })
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while removing the friend." })
return;

    }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const { requesterId } = req.body;
        const recipientId = req.session.user.id;
        
        await prisma.friendship.deleteMany({
            where: { requesterId, recipientId, status: "pending" }
        });
        
        await redisClient.srem(`user:${recipientId}:friend_requests`, requesterId);
        const requesterSocketId = await redisClient.hget(`user:${requesterId}`, "socketId");
        if (requesterSocketId) {
            io.to(requesterSocketId).emit("friend_request_rejected", { friendId: recipientId });
        }

        res.json({ message: "Friend request rejected." })
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while rejecting the friend request." })
return;

    }
}

export const fetchFriends = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const userId = req.session.user.id;
        
        const friends = await redisClient.smembers(`user:${userId}:friends`);
        const friendList = [];
        
        for (const friendId of friends) {
            let friend = await prisma.users.findUnique({
                where: { id: friendId }
            });
            
            if (friend) {
                const friendWithImg = {
                    ...friend,
                    img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato',
                    online: await redisClient.hget(`user:${friend.id}`, "socketId") ? true : false
                };
                friendList.push(friendWithImg);
            }
        }

        res.json(friendList)
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching friends." })
return;

    }
};

export const fetchFriendRequests = async (req: Request, res: Response) => {
    try {
        if (!req.session || !req.session.user) {
          res.status(401).json({ message: 'Unauthorized' })
return;

        }
        const userId = req.session.user.id;
        
        const friendRequests = await prisma.friendship.findMany({
            where: {
                recipientId: userId,
                status: "pending"
            },
            select: {
                requesterId: true
            }
        });
        
        const requestList = [];
        
        for (const request of friendRequests) {
            let requester = await prisma.users.findUnique({
                where: { id: request.requesterId }
            });

            if (!requester) {
                continue;
            }
            
            const requestInfo = {
                id: requester.id,
                name: requester?.name,
                img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'
            };

            requestList.push(requestInfo);
        }

        res.json(requestList)
return;

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching friend requests." })
return;

    }
}
