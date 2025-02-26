import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { handleDatabaseOperations } from 'src/common/utils/utils';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserRepositories {
  constructor(private prisma: PrismaService) {}
  async createUser(data: Prisma.UsersCreateInput): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      this.prisma.users.create({
        data,
      }),
    );
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      this.prisma.users.findUnique({
        where: { email },
      }),
    );
  }

  async findUserById(id: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      this.prisma.users.findUnique({
        where: { id },
      }),
    );
  }

  async updateUser(
    id: string,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      this.prisma.users.update({
        where: { id },
        data,
      }),
    );
  }

  async deleteUser(id: string): Promise<Users | null> {
    return await handleDatabaseOperations(() =>
      this.prisma.users.delete({
        where: { id },
      }),
    );
  }
}
