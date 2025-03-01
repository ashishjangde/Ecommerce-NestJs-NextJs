import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { handleDatabaseOperations } from 'src/common/utils/utils';

@Injectable()
export class SessionRepositories {
  constructor(private prisma: PrismaService) {}

  // Update to include ipAddress and userAgent
  async createSession(
    userId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.create({
        data: {
          userId,
          token,
          ipAddress,
          userAgent,
        },
      }),
    );
  }

  async findSessionByToken(token: string): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.findUnique({
        where: {
          token,
        },
        include: {
          user: true,
        },
      }),
    );
  }

  async updateSession(
    sessionId: string,
    newToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.update({
        where: {
          id: sessionId,
        },
        data: {
          token: newToken,
          updatedAt: new Date(),
          ...(ipAddress && { ipAddress }),
          ...(userAgent && { userAgent }),
        },
      }),
    );
  }

  async deleteSession(sessionId: string): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.delete({
        where: {
          id: sessionId,
        },
      }),
    );
  }

  async deleteAllUserSessions(userId: string): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.deleteMany({
        where: {
          userId,
        },
      }),
    );
  }

  async findAllUserSessions(userId: string): Promise<any[]> {
    const result = await handleDatabaseOperations(() =>
      this.prisma.sessions.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    );
    return result || [];
  }

  async findSessionById(id: string): Promise<any> {
    return handleDatabaseOperations(() =>
      this.prisma.sessions.findUnique({
        where: {
          id,
        },
      }),
    );
  }

  async deleteAllSessionsExceptOne(userId: string, token: string) {
    return handleDatabaseOperations(async () => {
      const result = await this.prisma.sessions.deleteMany({
        where: {
          userId,
          NOT: {
            token,
          },
        },
      });
      return { count: result.count };
    });
  }
}
