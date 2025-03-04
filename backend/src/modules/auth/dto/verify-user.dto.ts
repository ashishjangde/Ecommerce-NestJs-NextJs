import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class VerifyUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'VerificationCode must be at least 6 characters long',
  })
  @MaxLength(6, { message: 'VerificationCode cannot exceed 6 characters' })
  @ApiProperty()
  verificationCode: string;
}
