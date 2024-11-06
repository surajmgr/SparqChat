import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../db/queryHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const registerSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const registerController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    try {
      await registerSchema.validate(data);
    } catch (error) {
      return res.status(400).json({ message: error.errors[0] });
    }

    const { email, password } = data;
    
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
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
    
    req.session.user = { id: newUser.id, email: newUser.email, socketId: newUser.socketId };

    res.json({ message: 'Registered successfully', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
