import { Controller, Post, Body, HttpStatus, HttpCode, Res } from '@nestjs/common';
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
  ApiResponse as APIResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import ApiResponse from 'src/common/responses/ApiResponse';

@Controller('auth')
@ApiTags('Auth Routes')
@ApiExtraModels(ReturnAuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create New User' })
  @APIResponse({
    status: 201,
    description:
      'The user has been successfully created and verification code sent on the email.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @APIResponse({
    status: 200,
    description:
      'The non verified user has been successfully modified and erification code sent on the email. .',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @APIResponse({
    status: 400,
    description: 'The verified User already exist.',
    schema: createErrorResponse(400, 'Account already exist With this email'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  create(@Body() createAuthDto: CreateAuthDto , @Res() res) {
    return this.authService.create(createAuthDto , res);
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify Created User' })
  @APIResponse({
    status: 200,
    description: 'The user has been successfully verified.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @APIResponse({
    status: 400,
    description: 'The user has been successfully verified.',
    schema: createErrorResponse(400, 'Account already verified'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  verify(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verify(verifyUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  @APIResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    schema: ApiCustomResponse(ReturnAuthDto),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @APIResponse({
    status: 200,
    description: 'The user has been successfully sent the verification code.',
    schema: ApiCustomResponse({ message: 'Verification code sent on email' }),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not exist.',
    schema: createErrorResponse(400, 'Account "email" is not exist'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  forgotPassword(@Body() emailAuthDto: EmailAuthDto) {
    return this.authService.forgotPassword(emailAuthDto);
  }

  @Post('/check-verification-code/')
  @ApiOperation({ summary: 'Check Verification Code' })
  @APIResponse({
    status: 200,
    description: 'The verification code is correct.',
    schema: ApiCustomResponse({ message: 'Verification code is correct' }),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not exist.',
    schema: createErrorResponse(400, 'Account "email" is not exist'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  checkVerificationCode(checkVerificationCodeDto: VerifyUserDto) {
    return this.authService.checkVerificationCode(checkVerificationCodeDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @APIResponse({
    status: 200,
    description: 'The password has been successfully reset.',
    schema: ApiCustomResponse({
      message: 'Password has been successfully reset',
    }),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not verified.',
    schema: createErrorResponse(400, 'Account "email" is not verified'),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not exist.',
    schema: createErrorResponse(400, 'Account "email" is not exist'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  resetPassword(@Body() resetPasswordAuthDto: ResetPasswordAuthDto) {
    return this.authService.resetPassword(resetPasswordAuthDto);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout User' })
  @APIResponse({
    status: 200,
    description: 'The user has been successfully logged out.',
    schema: ApiCustomResponse({
      message: 'User has been successfully logged out',
    }),
  })
  @APIResponse({
    status: 400,
    description: 'The user is not logged in.',
    schema: createErrorResponse(400, 'User is not logged in'),
  })
  @APIResponse({
    status: 500,
    description: 'Server Error',
    schema: createErrorResponse(500, 'Internal Server Error'),
  })
  logout() {
    return this.authService.logout();
  }
}
