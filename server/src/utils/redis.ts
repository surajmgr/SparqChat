import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const store = new RedisStore({ client: redisClient });
