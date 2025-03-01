import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Verification code sent to email',
    example: '123456',
  })
  verificationCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
    },
  )
  newPassword: string;
}
