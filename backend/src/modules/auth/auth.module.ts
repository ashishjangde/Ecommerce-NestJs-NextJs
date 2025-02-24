import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepositories } from 'src/repositories/user.repositories';

@Module({
  controllers: [AuthController],
  providers: [AuthService , UserRepositories],
})
export class AuthModule {}
