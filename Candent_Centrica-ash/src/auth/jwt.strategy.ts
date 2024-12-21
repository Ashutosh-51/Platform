import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const jwt = request?.cookies?.jwt; // Extract JWT from cookies
          if (!jwt) {
            throw new UnauthorizedException('JWT not found in cookies'); // Throw error if not found
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get secret from env config
    });
  }

  // Validate function to decode token and extract payload
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return the decoded user info (e.g., userId and username)
    return { userId: payload.sub, username: payload.username };
  }
}
