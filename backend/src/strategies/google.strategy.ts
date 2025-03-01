import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import ConfigService from 'src/common/config/config.service';
import { UserRepositories } from 'src/repositories/user.repositories';
import { Roles } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private userRepositories: UserRepositories,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { name, emails } = profile;

      if (!emails || emails.length === 0) {
        return done(
          new UnauthorizedException('No email provided from Google'),
          undefined,
        );
      }

      const email = emails[0].value;

      let user = await this.userRepositories.findUserByEmail(email);

      if (!user) {
        user = await this.userRepositories.createUser({
          email,
          name: name.givenName + ' ' + name.familyName,
          verified: true,
          password: Math.random().toString(36).slice(-10), // Random password
          roles: [Roles.USER],
        });

        if (!user) {
          return done(new Error('Failed to create user'), undefined);
        }
      }

      // Return the user object (not null)
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }
}
