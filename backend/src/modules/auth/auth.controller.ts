import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  ApiCustomResponse,
  createErrorResponse,
} from 'src/common/responses/ApiResponse';
import { ReturnAuthDto } from './dto/return-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/emai-auth.dto';

@Controller('auth')
@ApiTags('Auth Routes')
@ApiExtraModels(ReturnAuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create New User' })
  @ApiResponse({
    status: 201,
    description:
      'The user has been successfully created and verification code sent on the email.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @ApiResponse({
    status: 200,
    description:
      'The non verified user has been successfully modified and erification code sent on the email. .',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @ApiResponse({
    status: 400,
    description: 'The verified User already exist.',
    schema: createErrorResponse(400, 'Account already exist With this email'),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify Created User' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully verified.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @ApiResponse({
    status: 400,
    description: 'The user has been successfully verified.',
    schema: createErrorResponse(400, 'Account already verified'),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  verify(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verify(verifyUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @ApiResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully sent the verification code.',
    schema: ApiCustomResponse({ message: 'Verification code sent on email' }),
  })
  @ApiResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @ApiResponse({
    status: 400,
    description: 'The user is not exist.',
    schema: createErrorResponse(400, 'Account "email" is not exist'),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  forgotPassword(@Body() emailAuthDto: EmailAuthDto) {
    return this.authService.forgotPassword(emailAuthDto);
  }

  @Post('/check-verification-code/')
  @ApiOperation({ summary: 'Check Verification Code' })
  @ApiResponse({
    status: 200,
    description: 'The verification code is correct.',
    schema: ApiCustomResponse({ message: 'Verification code is correct' }),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  checkVerificationCode(checkVerificationCodeDto: VerifyUserDto) {
    return this.authService.checkVerificationCode(checkVerificationCodeDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 200,
    description: 'The password has been successfully reset.',
    schema: ApiCustomResponse({
      message: 'Password has been successfully reset',
    }),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  resetPassword(@Body() ResetPasswordAuthDto: ResetPasswordAuthDto) {
    return this.authService.resetPassword(ResetPasswordAuthDto);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged out.',
    schema: ApiCustomResponse({
      message: 'User has been successfully logged out',
    }),
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  logout() {
    return this.authService.logout();
  }
}
