import { redisClient } from "../utils/redis";

export const authorizeUser = (socket, next) => {
    const session = socket.request.session;
    if (session.user) {
        socket.user = session.user;
        return next();
    }
    return next(new Error('Unauthorized'));
}

export const initializeUser = (socket, io) => {
    const userId = socket.user.id;
    redisClient.hset(`user:${userId}`, 'socketId', socket.user.socketId);
    socket.join(socket.user.socketId);
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

export const disconnectUser = (socket, io) => {
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
