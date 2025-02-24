import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseOperations');

export const Prisma = new PrismaClient();

export async function ConnectDb() {
  Promise.resolve(
    Prisma.$connect()
      .then(() => {
        logger.log('Connected to the database');
      })
      .catch((error: Error) => {
        logger.error('Error connecting to the database', error);
      }),
  );
}
