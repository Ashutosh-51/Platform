import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(data: Prisma.ECH_AccountCreateInput) {
    return this.prisma.eCH_Account.create({
      data,
    });
  }

  async getAccountById(id: string) {
    return this.prisma.eCH_Account.findUnique({
      where: { id },
      include: {
        address: true, // Include related address information
        subaccounts: true, // Include related subaccounts
        roles: true, // Include roles associated with the account
      },
    });
  }

  async getAllAccounts() {
    return this.prisma.eCH_Account.findMany({
      include: {
        address: true,
        subaccounts: true,
        roles: true,
      },
    });
  }

  async updateAccount(id: string, data: Prisma.ECH_AccountUpdateInput) {
    return this.prisma.eCH_Account.update({
      where: { id },
      data,
    });
  }

  async deleteAccount(id: string) {
    return this.prisma.eCH_Account.delete({
      where: { id },
    });
  }
}
