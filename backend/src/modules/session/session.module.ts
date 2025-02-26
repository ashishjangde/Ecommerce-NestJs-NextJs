import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionRepositories } from '../../repositories/session.repositories';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepositories],
  exports: [SessionService],
})
export class SessionModule {}
