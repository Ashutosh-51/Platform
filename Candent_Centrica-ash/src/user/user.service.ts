import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ECH_User } from '@prisma/client';
import { genSaltSync, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(id: string): Promise<ECH_User | null> {
    return this.prisma.eCH_User.findFirst({
      where: { id }, // Ensure username is a valid field in your ECH_User model
    });
  }

  // Create a new user
  async create(data: Prisma.ECH_UserCreateInput): Promise<ECH_User> {
    return this.prisma.eCH_User.create({ data });
  }

  // Get all users
  async findAll() {
    // return this.prisma.eCH_User.findMany();
    const users = await this.prisma.eCH_User.findMany();
    return { users };
  }

  // Get a single user by ID
  async findOne(id: string): Promise<ECH_User | null> {
    return this.prisma.eCH_User.findUnique({ where: { id: id } });
  }

  // Update a user
  async updateUser(
    id: string,
    data: Prisma.ECH_UserUpdateInput,
  ): Promise<ECH_User> {
    return this.prisma.eCH_User.update({
      where: { id },
      data,
    });
  }

  // Delete a user
  async delete(id: string): Promise<ECH_User> {
    return this.prisma.eCH_User.delete({
      where: { id: id },
    });
  }

  async deleteUserById(userId: string) {
    try {
      // Check if the user exists
      const user = await this.prisma.eCH_User.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Start deleting the related records (auth first, then user)
      const deletedAuth = await this.prisma.eCH_Auth.delete({
        where: { userId: userId },
      });

      // Now delete the user record
      const deletedUser = await this.prisma.eCH_User.delete({
        where: { id: userId },
      });

      return deletedUser; // Return deleted user info or confirmation
    } catch (error) {
      throw new Error('Error deleting user and auth: ' + error.message);
    }
  }

  async changePassword(id: string, password: string): Promise<object> {
    const salt = genSaltSync(10);
    const hashed = await hash('admin', salt);

    await this.prisma.eCH_Auth.update({
      where: { userId: id },
      data: { password: hashed },
    });

    return { message: 'User Password has been updated' };
  }
}
