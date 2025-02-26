import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionRepositories {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, token: string): Promise<any> {
    return this.prisma.sessions.create({
      data: {
        userId,
        token,
      },
    });
  }

  async findSessionByToken(token: string): Promise<any> {
    return this.prisma.sessions.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  async updateSession(sessionId: string, newToken: string): Promise<any> {
    return this.prisma.sessions.update({
      where: {
        id: sessionId,
      },
      data: {
        token: newToken,
        updatedAt: new Date(),
      },
    });
  }

  async deleteSession(sessionId: string): Promise<any> {
    return this.prisma.sessions.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteAllUserSessions(userId: string): Promise<any> {
    return this.prisma.sessions.deleteMany({
      where: {
        userId,
      },
    });
  }
}
