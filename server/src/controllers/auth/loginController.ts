import { Request, Response } from 'express';
import { Session } from 'express-session';
import { prisma } from '../../db/queryHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    try {
      await loginSchema.validate(data);
    } catch (error: any) {
      res.status(400).json({ message: error.errors[0] });
      return;
    }

    const { email, password } = data;

    // Find user by email
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!req.session || !req.session.user) {
      res.status(500).json({ message: 'Server error' });
      return;
    }
    
    req.session.user = { id: user.id, email: user.email, socketId: user.socketId ?? undefined };
    
    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkLoggedInStatus = (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    console.log(req.session.user);
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false, user: null });
  }
};
