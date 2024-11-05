import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const jwtProtect = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in' });
  };
  