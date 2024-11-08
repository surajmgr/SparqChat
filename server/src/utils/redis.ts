import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL || (() => { throw new Error('REDIS_URL is not defined'); })());

export const store = new RedisStore({ client: redisClient });
