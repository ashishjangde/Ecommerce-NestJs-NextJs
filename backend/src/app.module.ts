import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [AuthModule, SessionModule],
})
export class AppModule {}
