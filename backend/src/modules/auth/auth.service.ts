import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import { UserRepositories } from 'src/repositories/user.repositories';
import { BadRequestException } from '@nestjs/common';
import { ReturnAuthDto } from './dto/return-auth.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from '@prisma/client';
import ApiResponse from 'src/common/responses/ApiResponse';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userRepositories: UserRepositories) {}
  
  async create(createAuthDto: CreateAuthDto , res : Response) {
    const existingUser = await this.userRepositories.findUserByEmail(createAuthDto.email);
    if(existingUser?.verified) {
      throw new BadRequestException('Account already exist With this email');
    }
    
    const userData = {
      ...createAuthDto,
      password: createAuthDto.password,
      verified: false,
      roles: [Roles.USER] 
    };

    if(existingUser) {
      const updatedUser = await this.userRepositories.updateUser(existingUser.id, userData);
      if (!updatedUser) throw new BadRequestException('Failed to update user');
      res.status(HttpStatus.OK).json(new ApiResponse(plainToClass(ReturnAuthDto, updatedUser)));
      return;
    } else {
      const newUser = await this.userRepositories.createUser(userData);
      if (!newUser) throw new BadRequestException('Failed to create user');
      res.status(HttpStatus.CREATED).json(new ApiResponse(plainToClass(ReturnAuthDto, newUser)));
      return;
    }
  }
  
  verify(verifyUserDto: VerifyUserDto) {
    throw new Error('Method not implemented.');
  }
  login(LoginAuthDto: LoginAuthDto) {
    throw new Error('Method not implemented.');
  }
  forgotPassword(emailAuthDto: EmailAuthDto) {
    throw new Error('Method not implemented.');
  }
  checkVerificationCode(checkVerificationCodeDto: VerifyUserDto) {
    throw new Error('Method not implemented.');
  }
  resetPassword(resetPasswordAuthDto: ResetPasswordAuthDto) {
    throw new Error('Method not implemented.');
  }
  logout() {
    throw new Error('Method not implemented.');
  }
}
