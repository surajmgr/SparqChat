import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RateLimitRedisStore, { RedisReply } from 'rate-limit-redis';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { redisClient } from '../utils/redis.js';
import dotnet from 'dotenv';

dotnet.config();

export const securityMiddleware = (app: Application): void => {
  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", process.env.API_DOMAIN as string],
        },
      },
    })
  );

  // Rate limiter using Redis
  app.use(
    rateLimit({
      store: new RateLimitRedisStore({
        sendCommand: async (
          command: string,
          ...args: (string | number | Buffer)[]
        ): Promise<RedisReply> => {
          return redisClient.call(command, ...args) as Promise<RedisReply>;
        },        
      }),
      windowMs: 1 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later',
    })
  );

  // Session management
  app.use(sessionMiddleware);

  // CSRF Protection (Exclude API routes)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    return csurf({ cookie: true })(req, res, next);
  });

  // Handle CSRF errors
  const csrfErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ message: 'Invalid CSRF token' })
return;

    }
    next(err);
  };
  
  app.use(csrfErrorHandler);
};

// Protect Routes Middleware
export const protectRoutes = (
  protectedPatterns: string[],
  func?: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isProtected = protectedPatterns.some((pattern) =>
      req.path.startsWith(pattern)
    );

    if (!isProtected) {
      return next();
    }

    if (func) {
      return func(req, res, next);
    }

    res.status(401).json({ message: 'Unauthorized: No entry route' })
return;

  };
};

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient as Redis }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

export const wrap = (expressMiddleware: any) => (socket: any, next: any) =>
  expressMiddleware(socket.request, {}, next);
