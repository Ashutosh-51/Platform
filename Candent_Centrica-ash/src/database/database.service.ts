import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  // Initialize the Prisma client
  async onModuleInit() {
    await this.$connect();
  }
}
