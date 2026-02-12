import { PrismaClient } from '../generated/prisma-client-thread';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrismaThread = global as unknown as {
  prismaThread: PrismaClient;
};

const connectionString = `${process.env.THREAD_DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaThread =
  globalForPrismaThread.prismaThread ||
  new PrismaClient({
    adapter
  });

if (process.env.NODE_ENV !== 'production')
  globalForPrismaThread.prismaThread = prismaThread;

export { prismaThread };
export default prismaThread;
