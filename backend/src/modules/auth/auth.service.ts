import {
  Injectable,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { EmailAuthDto } from './dto/email-auth.dto';
import { UserRepositories } from 'src/repositories/user.repositories';
import { ReturnAuthDto } from './dto/return-auth.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from '@prisma/client';
import ApiResponse from 'src/common/responses/ApiResponse';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import ConfigService from 'src/common/config/config.service';
import { SessionRepositories } from 'src/repositories/session.repositories';
import { OtpUtil } from 'src/common/utils/otp.util';
import { EmailService } from 'src/common/utils/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositories: UserRepositories,
    private readonly sessionRepositories: SessionRepositories,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Create a new user account and send verification code
   */
  async create(createAuthDto: CreateAuthDto, res: Response) {
    try {
      // Hash the password before storing
      const hashedPassword = await this.hashPassword(createAuthDto.password);

      // Check if user already exists
      const existingUser = await this.userRepositories.findUserByEmail(
        createAuthDto.email,
      );

      // If user exists and is verified, don't allow registration
      if (existingUser?.verified) {
        throw new BadRequestException('Account already exists with this email');
      }

      // Generate verification code with 10 minute validity
      const verificationCode = OtpUtil.generateOtp(6);
      const verificationCodeExpireAt = OtpUtil.getExpirationTime(10);

      const userData = {
        ...createAuthDto,
        password: hashedPassword,
        verified: false,
        verificationCode,
        verificationCodeExpireAt,
        roles: [Roles.USER],
      };

      // Update existing user or create new one
      let user;
      if (existingUser) {
        user = await this.userRepositories.updateUser(
          existingUser.id,
          userData,
        );
        if (!user) throw new BadRequestException('Failed to update user');
      } else {
        user = await this.userRepositories.createUser(userData);
        if (!user) throw new BadRequestException('Failed to create user');
      }

      // Send verification email
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationCode,
      );

      // Return user data (without sensitive information)
      const { password, verificationCode: code, ...safeUser } = user;

      res.status(existingUser ? HttpStatus.OK : HttpStatus.CREATED).json(
        new ApiResponse({
          message:
            'Verification code sent to your email. Please verify your account.',
          user: plainToClass(ReturnAuthDto, safeUser),
        }),
      );
      return;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  /**
   * Helper method to create a session with device information
   */
  private async createSessionWithDeviceInfo(
    userId: string,
    token: string,
    req: any,
  ): Promise<any> {
    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.sessionRepositories.createSession(
      userId,
      token,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Verify user account with OTP
   */
  async verify(verifyUserDto: VerifyUserDto, req: any, res: Response) {
    const { email, verificationCode } = verifyUserDto;

    const user = await this.userRepositories.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new ConflictException('Account is already verified');
    }

    // Check if verification code is valid and not expired
    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      !user.verificationCodeExpireAt ||
      !OtpUtil.isValid(user.verificationCodeExpireAt)
    ) {
      throw new BadRequestException('Verification code has expired');
    }

    // Mark user as verified and clear verification data
    const verifiedUser = await this.userRepositories.updateUser(user.id, {
      verified: true,
      verificationCode: null,
      verificationCodeExpireAt: null,
    });

    if (!verifiedUser) {
      throw new BadRequestException('Failed to verify user');
    }

    // Generate tokens for automatic login after verification
    const tokens = this.generateTokens(verifiedUser);

    // Store refresh token with device info
    await this.createSessionWithDeviceInfo(
      verifiedUser.id,
      tokens.refreshToken,
      req,
    );

    // Set cookies
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message: 'Account verified successfully',
        user: plainToClass(ReturnAuthDto, verifiedUser),
        access_token: tokens.accessToken,
      }),
    );
    return;
  }

  /**
   * Check verification code validity without verifying the account
   */
  async checkVerificationCode(
    checkVerificationCodeDto: VerifyUserDto,
    res: Response,
  ) {
    const { email, verificationCode } = checkVerificationCodeDto;

    const user = await this.userRepositories.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if verification code is valid and not expired
    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      !user.verificationCodeExpireAt ||
      !OtpUtil.isValid(user.verificationCodeExpireAt)
    ) {
      throw new BadRequestException('Verification code has expired');
    }

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message: 'Verification code is valid',
      }),
    );
    return;
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(emailAuthDto: EmailAuthDto, res: Response) {
    const { email } = emailAuthDto;

    const user = await this.userRepositories.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new ConflictException('Account is already verified');
    }

    // Generate new verification code with 10 minute validity
    const verificationCode = OtpUtil.generateOtp(6);
    const verificationCodeExpireAt = OtpUtil.getExpirationTime(10);

    // Update user with new code
    await this.userRepositories.updateUser(user.id, {
      verificationCode,
      verificationCodeExpireAt,
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationCode,
    );

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message: 'Verification code sent to your email',
      }),
    );
    return;
  }

  /**
   * Send password reset code
   */
  async forgotPassword(emailAuthDto: EmailAuthDto, res: Response) {
    const { email } = emailAuthDto;

    const user = await this.userRepositories.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verified) {
      throw new BadRequestException(
        'Account is not verified. Please verify your account first.',
      );
    }

    // Generate verification code with 10 minute validity
    const verificationCode = OtpUtil.generateOtp(6);
    const verificationCodeExpireAt = OtpUtil.getExpirationTime(10);

    // Update user with new code
    await this.userRepositories.updateUser(user.id, {
      verificationCode,
      verificationCodeExpireAt,
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      verificationCode,
    );

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message: 'Password reset code sent to your email',
      }),
    );
    return;
  }

  /**
   * Reset password with verification code
   */
  async resetPassword(
    resetPasswordAuthDto: ResetPasswordAuthDto,
    res: Response,
  ) {
    const { email, verificationCode, newPassword } = resetPasswordAuthDto;

    const user = await this.userRepositories.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verified) {
      throw new BadRequestException('Account is not verified');
    }

    // Check if verification code is valid and not expired
    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (
      !user.verificationCodeExpireAt ||
      !OtpUtil.isValid(user.verificationCodeExpireAt)
    ) {
      throw new BadRequestException('Verification code has expired');
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user with new password and clear verification data
    await this.userRepositories.updateUser(user.id, {
      password: hashedPassword,
      verificationCode: null,
      verificationCodeExpireAt: null,
    });

    // Invalidate all existing sessions for security
    await this.sessionRepositories.deleteAllUserSessions(user.id);

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message:
          'Password has been reset successfully. Please login with your new password.',
      }),
    );
    return;
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepositories.findUserByEmail(email);

    // No user found
    if (!user) {
      return null;
    }

    // User not verified
    if (!user.verified) {
      throw new UnauthorizedException(
        'Please verify your account before logging in',
      );
    }

    // Compare password
    const isPasswordValid = await this.comparePasswords(pass, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password, ...result } = user;
    return result;
  }

  /**
   * Login user
   */
  async login(loginAuthDto: LoginAuthDto, req: any, res: Response) {
    try {
      const user = await this.validateUser(
        loginAuthDto.email,
        loginAuthDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Store refresh token in sessions with device info
      await this.createSessionWithDeviceInfo(user.id, tokens.refreshToken, req);

      // Set cookies
      this.setCookies(res, tokens.accessToken, tokens.refreshToken);

      // Return user data and tokens
      res.status(HttpStatus.OK).json(
        new ApiResponse({
          user: plainToClass(ReturnAuthDto, user),
          access_token: tokens.accessToken,
        }),
      );
      return;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(req: any, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Check if session exists
      const session =
        await this.sessionRepositories.findSessionByToken(refreshToken);

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find the user
      const user = await this.userRepositories.findUserById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Update session with new refresh token but preserve device info
      await this.sessionRepositories.updateSession(
        session.id,
        tokens.refreshToken,
        session.ipAddress,
        session.userAgent,
      );

      // Set new cookies
      this.setCookies(res, tokens.accessToken, tokens.refreshToken);

      // Return success response
      res.status(HttpStatus.OK).json(
        new ApiResponse({
          message: 'Tokens refreshed successfully',
          access_token: tokens.accessToken,
        }),
      );
      return;
    } catch (error) {
      // Clear cookies on error
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Social login
   */
  async socialLogin(user: any, req: any, res: Response) {
    // For social logins, users are automatically verified
    const tokens = this.generateTokens(user);

    // Store refresh token in sessions with device info
    await this.createSessionWithDeviceInfo(user.id, tokens.refreshToken, req);

    // Set cookies
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return user data or redirect to frontend
    return {
      user: plainToClass(ReturnAuthDto, user),
      access_token: tokens.accessToken,
    };
  }

  /**
   * Logout user
   */
  async logout(req: any, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      // Find and delete the session
      const session =
        await this.sessionRepositories.findSessionByToken(refreshToken);
      if (session) {
        await this.sessionRepositories.deleteSession(session.id);
      }
    }

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.status(HttpStatus.OK).json(
      new ApiResponse({
        message: 'Logged out successfully',
      }),
    );
    return;
  }

  // Helper methods for password handling
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(
    plainText: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  // Generate tokens
  private generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Set cookies helper method
  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    // Set access token as HTTP-only cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh', // Only sent to the refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
