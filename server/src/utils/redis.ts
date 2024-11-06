import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL);

export const store = new RedisStore({ client: redisClient });
