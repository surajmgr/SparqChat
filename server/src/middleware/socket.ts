import { redisClient } from '../utils/redis.js';

import { Socket, Server, ExtendedError } from "socket.io";
import { NextFunction } from 'express';

export const authorizeUser = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const session = socket.request.session;
    
    if (session && session.user) {
        socket.user = session.user;
        return next();
    }

    const error: ExtendedError = new Error('Unauthorized');
    return next(error);
};


export const initializeUser = (socket: Socket, io: Server) => {
    if (socket.user) {
        const userId = socket.user.id;
        redisClient.hset(`user:${userId}`, 'socketId', socket.user.socketId || socket.id);
        socket.join(socket.user.socketId || socket.id);
        redisClient.smembers(`user:${userId}:friends`, (err, friends) => {
            if (friends) {
                friends.forEach((friendId) => {
                    redisClient.hget(`user:${friendId}`, "socketId", (err, friendSocketId) => {
                        if (friendSocketId) {
                            io.to(friendSocketId).emit("friend_online", { friendId: userId });
                        }
                    });
                });
            }
        });
    }
}

export const disconnectUser = (socket: Socket, io: Server) => {
    if (!socket.user) {
        return;
    }
    const userId = socket.user.id;
    redisClient.hdel(`user:${userId}`, 'socketId');
    redisClient.smembers(`user:${userId}:friends`, (err, friends) => {
        if (friends) {
            friends.forEach((friendId) => {
                redisClient.hget(`user:${friendId}`, "socketId", (err, friendSocketId) => {
                    if (friendSocketId) {
                        io.to(friendSocketId).emit("friend_offline", { friendId: userId });
                    }
                });
            });
        }
    });
}
