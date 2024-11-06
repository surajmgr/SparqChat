import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    return await prisma.$queryRawUnsafe(query, ...params);
  } catch (err) {
    console.error('Database query error', err);
    throw err;
  }
};
