import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordAuthDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'VerificationCode must be at least 6 characters long',
  })
  @MaxLength(6, { message: 'VerificationCode cannot exceed 6 characters' })
  @ApiProperty()
  verificationCode: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  })
  password: string;
}
