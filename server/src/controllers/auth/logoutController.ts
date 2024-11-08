import { Request, Response } from 'express';

export const logoutController = (req: Request, res: Response) => {
  (req.session as any).destroy((err: any) => {
    if (err) {
      res.status(500).json({ message: 'Failed to log out' })
return;

    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};
