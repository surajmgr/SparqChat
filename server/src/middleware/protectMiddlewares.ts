import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in' })
return;

  };
  