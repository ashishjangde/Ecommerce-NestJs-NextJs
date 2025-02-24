import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/emai-auth.dto';

@Injectable()
export class AuthService {
  forgotPassword(emailAuthDto: EmailAuthDto) {
    throw new Error('Method not implemented.');
  }
  checkVerificationCode(checkVerificationCodeDto: VerifyUserDto) {
    throw new Error('Method not implemented.');
  }
  resetPassword(ResetPasswordAuthDto: ResetPasswordAuthDto) {
    throw new Error('Method not implemented.');
  }
  verify(verifyUserDto: VerifyUserDto) {
    throw new Error('Method not implemented.');
  }
  create(createAuthDto: CreateAuthDto) {
    throw new Error('Method not implemented.');
  }
  login(LoginAuthDto: LoginAuthDto) {
    throw new Error('Method not implemented.');
  }
  logout() {
    throw new Error('Method not implemented.');
  }
}
