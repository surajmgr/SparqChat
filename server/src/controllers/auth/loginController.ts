import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../db/queryHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const loginController = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    try {
      await loginSchema.validate(data);
    } catch (error) {
      return res.status(400).json({ message: error.errors[0] });
    }

    const { email, password } = data;

    // Find user by email
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });

    // Using Session
    req.session.user = { id: user.id, email: user.email, socketId: user.socketId };
    
    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkLoggedInStatus = (req: Request, res: Response) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false, user: null });
  }
};
