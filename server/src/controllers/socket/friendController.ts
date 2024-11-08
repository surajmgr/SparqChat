import { prisma } from '../../db/queryHandler.js';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { redisClient } from '../../utils/redis.js';

import { Socket } from 'socket.io';

export const addFriend = async (friendId: string, socket: Socket, io: any, cb: (response: { success: boolean; message?: string; friend?: any }) => void) => {
    try {
        console.log("Adding friend:", friendId);
        
        if (socket.user && socket.user.id === friendId) {
            return cb({ success: false, message: "You cannot add yourself as a friend" });
        }

        // Get friend's socket ID from Redis
        const friendSocketId = await redisClient.hget(`user:${friendId}`, "socketId");

        if (friendSocketId && socket.user) {
            io.to(friendSocketId).emit("friendRequest", {
                id: socket.user.id,
                email: socket.user.email,
            });
        }

        if (!friendSocketId) {
            return cb({ success: false, message: "User not found" });
        }

        // Dummy response (Replace this with a database call)
        const newFriend = {
            id: friendId,
            name: "Alice", // Fetch actual name from DB
            connected: !!friendSocketId,
            img: "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato",
        };

        console.log("Friend added:", newFriend, friendSocketId, !!friendSocketId);

        cb({ success: true, friend: newFriend });
    } catch (error) {
        console.error("Error adding friend:", error);
        cb({ success: false, message: "Failed to add friend" });
    }
};

export const removeFriend = (friendId: string, cb: (response: { success: boolean; message?: string }) => void) => {
    console.log('Removing friend', friendId);

    cb({ success: true });
}

