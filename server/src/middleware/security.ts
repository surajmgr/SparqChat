import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RateLimitRedisStore from 'rate-limit-redis';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';
import { Application, Request, Response, NextFunction } from 'express';

export const securityMiddleware = (app: Application): void => {
  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", process.env.API_DOMAIN as string],
        },
      },
    })
  );

  // Initialize Redis client
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  });
  const store = new RedisStore({ client: redisClient });

  // Rate limiter using Redis
  app.use(
    rateLimit({
      store: new RateLimitRedisStore({
        sendCommand: async (...args: string[]) => redisClient.call(...args),
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
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
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    next(err);
  });
};

// Protect Routes Middleware
export const protectRoutes = (
  protectedPatterns: string[],
  func?: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const isProtected = protectedPatterns.some((pattern) =>
      req.path.startsWith(pattern)
    );

    if (!isProtected) {
      return next();
    }

    if (func) {
      return func(req, res, next);
    }

    return res.status(401).json({ message: 'Unauthorized: No entry route' });
  };
};

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: new Redis() }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

export const wrap = (expressMiddleware: any) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);
