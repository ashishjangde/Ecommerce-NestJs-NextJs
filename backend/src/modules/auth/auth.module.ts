import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { GoogleStrategy } from '../../strategies/google.strategy';
import { GithubStrategy } from '../../strategies/github.strategy';
import { UserRepositories } from '../../repositories/user.repositories';
import { SessionRepositories } from '../../repositories/session.repositories';
import { ConfigModule } from 'src/common/config/config.module';
import ConfigService from 'src/common/config/config.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { EmailService } from 'src/common/utils/email.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule, 
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') || '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepositories,
    SessionRepositories,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
