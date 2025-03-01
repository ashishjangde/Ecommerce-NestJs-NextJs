import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../common/decorators/public.decorator';
import { Response } from 'express';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import ApiResponse from 'src/common/responses/ApiResponse';
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
  ApiCookieAuth,
} from '@nestjs/swagger';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/email-auth.dto';

@Controller('auth')
@ApiTags('Auth Routes')
@ApiCookieAuth()
@ApiExtraModels(ReturnAuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
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
      'The non verified user has been successfully modified and verification code sent on the email. .',
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
  create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    return this.authService.create(createAuthDto, res);
  }

  @Public()
  @Post('login')
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
  login(@Body() loginAuthDto: LoginAuthDto, @Req() req, @Res() res: Response) {
    return this.authService.login(loginAuthDto, req, res);
  }

  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @APIResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
    schema: ApiCustomResponse({ message: 'Tokens refreshed successfully' }),
  })
  @APIResponse({
    status: 401,
    description: 'Invalid refresh token.',
    schema: createErrorResponse(401, 'Invalid refresh token'),
  })
  refresh(@Req() req, @Res() res: Response) {
    return this.authService.refreshTokens(req, res);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  googleAuth() {
    // This route initiates the Google OAuth flow
    // The guard handles redirection to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const userResponse = await this.authService.socialLogin(req.user, req, res);

    // You can redirect to your frontend with user info
    // res.redirect(`${process.env.FRONTEND_URL}/auth/success`);

    // Or just return the user data
    res.status(HttpStatus.OK).json(new ApiResponse(userResponse));
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubAuth() {
    // This route initiates the GitHub OAuth flow
    // The guard handles redirection to GitHub
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const userResponse = await this.authService.socialLogin(req.user, req, res);

    // You can redirect to your frontend with user info
    // res.redirect(`${process.env.FRONTEND_URL}/auth/success`);

    // Or just return the user data
    res.status(HttpStatus.OK).json(new ApiResponse(userResponse));
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
  verify(
    @Body() verifyUserDto: VerifyUserDto,
    @Req() req,
    @Res() res: Response,
  ) {
    return this.authService.verify(verifyUserDto, req, res);
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
  forgotPassword(@Body() emailAuthDto: EmailAuthDto, @Res() res: Response) {
    return this.authService.forgotPassword(emailAuthDto, res);
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
  checkVerificationCode(
    @Body() checkVerificationCodeDto: VerifyUserDto,
    @Res() res: Response,
  ) {
    return this.authService.checkVerificationCode(
      checkVerificationCodeDto,
      res,
    );
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
  resetPassword(
    @Body() resetPasswordAuthDto: ResetPasswordAuthDto,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(resetPasswordAuthDto, res);
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
  logout(@Req() req, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
