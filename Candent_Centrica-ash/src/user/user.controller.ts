import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('/api/users')
export class UsersController {
  authService: any;
  constructor(private readonly UserService: UserService) {}

  @Post()
  async create(@Body() userData: Prisma.ECH_UserCreateInput) {
    return this.UserService.create(userData);
  }

  @Get()
  async findAll() {
    return this.UserService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.UserService.findOne(id);
  }

  @Put('update')
  async updateUser(@Body() body: any) {
    try {
      console.log('Received body:', body); // Debug log to verify request payload
      // Example update logic with Prisma or another ORM
      return await this.UserService.updateUser(body.id, body);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.UserService.delete(id);
  }

  // Assuming you have a delete endpoint in the AuthController
  @Delete('delete/:id')
  async deleteUser(@Param('id') userId: string) {
    try {
      // Attempt to delete the user and auth using the provided userId
      const deletedUser = await this.authService.deleteUserById(userId);
      return {
        message: 'User deleted successfully',
        data: deletedUser, // Send back the deleted user or auth data if needed
      };
    } catch (error) {
      // Log error for debugging
      console.error('Error deleting user and auth:', error);
      return {
        message: 'Error deleting user and auth',
        error: error.message,
      };
    }
  }

  @Put(':id/change/password')
  async change_password(
    @Param('id') id: string,
    @Body() userData: { password: string },
  ) {
    return this.UserService.changePassword(id, userData.password);
  }

  @Put(':id/reset/password')
  async reset_password(
    @Param('id') id: string,
    @Body() userData: Prisma.ECH_UserUpdateInput,
  ) {
    return { message: 'Check Your Registered Email to Continue' };
  }
}
