import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';

@Controller('/api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() data: Prisma.ECH_AccountCreateInput) {
    return this.accountService.createAccount(data);
  }

  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return this.accountService.getAccountById(id);
  }

  @Get()
  async getAllAccounts() {
    return this.accountService.getAllAccounts();
  }

  @Put(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() data: Prisma.ECH_AccountUpdateInput,
  ) {
    return this.accountService.updateAccount(id, data);
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    return this.accountService.deleteAccount(id);
  }
}
