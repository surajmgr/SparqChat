import { Request, Response } from 'express';
import { prisma } from '../../db/queryHandler';
import { redisClient } from '../../utils/redis';
import { io } from '../../server';

export const randomChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.session.user.id;

    const userCount = await prisma.users.count({
      where: {
        id: {
          not: userId,
        },
      },
    });

    if (userCount === 0) {
      res.status(404).json({ message: 'No users found.' });
      return;
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
      res.status(404).json({ message: 'No users found.' });
      return;
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
    
    res.status(200).json({
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
    res.status(500).json({ message: 'Internal server error.' });
    return;
  }
};

export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, chatUserId, chatEmail } = req.body;

    const user =
      chatUserId != 'null'
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
      res.status(404).json({ message: 'User not found.' });
      return;
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
    
    res.status(200).json({
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
    res.status(500).json({ message: 'Internal server error.' });
    return;
  }
};

export const sendChatMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { message, receiverId } = req.body;
    const senderId = req.session.user.id;

    let chatMessage = await prisma.chat.create({
      data: {
        message,
        senderId,
        receiverId,
      },
    });

    const newChatMessage = {
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
      io.to(receiverSocketId).emit('new_message', newChatMessage);
    }

    res.status(200).json({ message: 'Message sent successfully.' });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
    return;
  }
};

export const fetchChattedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.session.user.id;
    res.status(401).json({ message: 'Unauthorized' });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
    return;
  }
};
