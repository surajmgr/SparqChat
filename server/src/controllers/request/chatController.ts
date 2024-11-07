import { Request, Response } from 'express';
import { prisma } from '../../db/queryHandler';
import { redisClient } from '../../utils/redis';
import { io } from '../../server';

export const randomChat = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user.id;

    const userCount = await prisma.users.count({
      where: {
        id: {
          not: userId,
        },
      },
    });

    if (userCount === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Get a random offset (skip index)
    const randomOffset = Math.floor(Math.random() * userCount);

    const randomUser = await prisma.users.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      take: 1,
      skip: randomOffset, // Skip random users
    });

    if (!randomUser.length) {
      return res.status(404).json({ message: 'No users found.' });
    }

    const chatHistory = await prisma.chat.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: randomUser[0].id,
          },
          {
            senderId: randomUser[0].id,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedChatHistory = chatHistory.map((chat) => ({
      id: chat.id,
      text: chat.message,
      timestamp: chat.createdAt,
      senderId: chat.senderId,
      receiverId: chat.receiverId,
    }));

    return res.status(200).json({
      id: randomUser[0].id,
      name: randomUser[0].name,
      img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato',
      myImg: 'https://placehold.co/200x/8be9fd/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato',
      online: true,
      isFriend: false,
      messages: formattedChatHistory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { userId, chatUserId, chatEmail } = req.body;

    const user = chatUserId != 'null'
      ? await prisma.users.findUnique({
          where: {
            id: chatUserId,
          },
        })
      : await prisma.users.findUnique({
          where: {
            email: chatEmail,
          },
        });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const chatMessages = await prisma.chat.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedChatMessages = chatMessages.map((chat) => ({
      id: chat.id,
      text: chat.message,
      timestamp: chat.createdAt,
      senderId: chat.senderId,
      receiverId: chat.receiverId,
    }));

    return res.status(200).json({
      id: user.id,
      name: user.name,
      img: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato',
      myImg: 'https://placehold.co/200x/8be9fd/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato',
      online: true,
      isFriend: false,
      messages: formattedChatMessages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, receiverId } = req.body;
    const senderId = req.session.user.id;

    let chatMessage = await prisma.chat.create({
      data: {
        message,
        senderId,
        receiverId,
      },
    });

    chatMessage = {
      id: chatMessage.id,
      text: chatMessage.message,
      timestamp: chatMessage.createdAt,
      senderId: chatMessage.senderId,
      receiverId: chatMessage.receiverId,
    };

    const receiverSocketId = await redisClient.hget(
      `user:${receiverId}`,
      'socketId'
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_message', chatMessage);
    }

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const fetchChattedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user.id;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
