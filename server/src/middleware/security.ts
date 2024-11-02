import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { Application, Request, Response, NextFunction } from 'express';

export const securityMiddleware = (app: Application): void => {
  app.use(cookieParser());
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", process.env.API_DOMAIN as string]
      }
    }
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
  }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    csurf({ cookie: true })(req, res, next);
  });
};

export const protectRoutes = (protectedPatterns: string[], func?: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const isProtected = protectedPatterns.some(pattern => req.path.startsWith(pattern));

    if (!isProtected) {
      next();
      return;
    }

    if (func) {
      func(req, res, next);
    } else {
      res.status(401).json({ message: 'Unauthorized: No entry route' });
    }
  };
};
