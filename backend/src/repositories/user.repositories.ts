import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { Prisma as db } from 'src/lib/db/dbConfig';
import { handleDatabaseOperations } from 'src/common/utils/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepositories {
  async createUser(data: Prisma.UsersCreateInput): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      db.users.create({
        data,
      }),
    );
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      db.users.findUnique({
        where: { email },
      }),
    );
  }

  async findUserById(id: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      db.users.findUnique({
        where: { id },
      }),
    );
  }

  async updateUser(
    id: string,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      db.users.update({
        where: { id },
        data,
      }),
    );
  }

  async deleteUser(id: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      db.users.delete({
        where: { id },
      }),
    );
  }
}
