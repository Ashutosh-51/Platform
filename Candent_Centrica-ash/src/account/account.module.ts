import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, PrismaService], // Add PrismaService here
})
export class AccountModule {}
