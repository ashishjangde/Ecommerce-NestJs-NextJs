import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import ConfigService from 'src/common/config/config.service';
import { UserRepositories } from 'src/repositories/user.repositories';
import { Roles } from '@prisma/client';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private userRepositories: UserRepositories
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { username, displayName, emails } = profile;
    
    // GitHub may not provide email based on user privacy settings
    const email = emails && emails.length > 0 ? emails[0].value : `${username}@github.com`;
    
    let user = await this.userRepositories.findUserByEmail(email);
    
    if (!user) {
      user = await this.userRepositories.createUser({
        email,
        name: displayName || username,
        verified: true,
        password: Math.random().toString(36).slice(-10), // Random password
        roles: [Roles.USER]
      });
    }

    done(null, user);
  }
}
