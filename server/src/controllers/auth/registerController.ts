import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../db/queryHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const registerSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    
    try {
      await registerSchema.validate(data);
    } catch (error: any) {
      res.status(400).json({ message: error.errors[0] })
return;

    }

    const { email, password } = data;
    
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      res.status(400).json({ message: 'User already exists' })
return;

    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        socketId: uuidv4(),
      },
    });

    if (!req.session || !req.session.user) {
      res.status(500).json({ message: 'Server error' })
return;

    }
    
    req.session.user = { id: newUser.id, email: newUser.email, socketId: newUser.socketId ?? undefined };

    res.json({ message: 'Registered successfully', user: req.session.user })
return;

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error' })
return;

  }
};
