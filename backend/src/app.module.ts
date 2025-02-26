import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    SessionModule,
  ],
})
export class AppModule {}
