import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SessionRepositories {
  constructor(private prisma: PrismaService) {}

  // Update to include ipAddress and userAgent
  async createSession(userId: string, token: string, ipAddress?: string, userAgent?: string): Promise<any> {
    return this.prisma.sessions.create({
      data: {
        userId,
        token,
        ipAddress,
        userAgent,
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

  // Update to preserve or update device info
  async updateSession(sessionId: string, newToken: string, ipAddress?: string, userAgent?: string): Promise<any> {
    return this.prisma.sessions.update({
      where: {
        id: sessionId,
      },
      data: {
        token: newToken,
        updatedAt: new Date(),
        // Only update device info if provided
        ...(ipAddress && { ipAddress }),
        ...(userAgent && { userAgent }),
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

  async findAllUserSessions(userId: string): Promise<any[]> {
    return this.prisma.sessions.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findSessionById(id: string): Promise<any> {
    return this.prisma.sessions.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteAllSessionsExceptOne(userId: string, token: string): Promise<{ count: number }> {
    const result = await this.prisma.sessions.deleteMany({
      where: {
        userId,
        NOT: {
          token,
        },
      },
    });
    
    return { count: result.count };
  }
}
