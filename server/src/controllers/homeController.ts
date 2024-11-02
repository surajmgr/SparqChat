import { Request, Response } from 'express';

export const homeController = (req: Request, res: Response): void => {
  res.send('Hello from the controller!');
};
