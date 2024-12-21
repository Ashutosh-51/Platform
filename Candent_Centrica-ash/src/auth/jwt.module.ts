// src/auth/jwt/jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'JWT_SECRET', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  providers: [AuthService],
  exports: [NestJwtModule],
})
export class JwtModule {}
