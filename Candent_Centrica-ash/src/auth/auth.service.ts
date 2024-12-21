import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as crypto from 'crypto';
import { genSaltSync, hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { ECH_User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token); // Verify the token
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async createUserWithAuth(userData: {
    firstName: string;
    middleName?: string;
    email: string;
    contact: string;
    createdBy: string;
    updatedBy: string;
    password: string;
  }) {
    // Retrieve the default address from the database
    const defaultAddress = await this.prisma.eCH_Address.findFirst();

    if (!defaultAddress) {
      throw new Error(
        'Default address not found. Please create an address entry first.',
      );
    }

    // Step 1: Hash the password before saving
    const salt = genSaltSync(10);
    const hashedPassword = await hash(userData.password, salt);

    // Step 2: Create the user
    const user = await this.prisma.eCH_User.create({
      data: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        email: userData.email,
        contact: userData.contact,
        createdBy: userData.createdBy,
        updatedBy: userData.updatedBy,
        currentAddressId: defaultAddress.id,
        permanentAddressId: defaultAddress.id,
      },
    });

    // Step 3: Create auth credentials using the created user ID
    const auth = await this.prisma.eCH_Auth.create({
      data: {
        userId: user.id,
        username: userData.firstName,
        password: hashedPassword, // Save the hashed password here
        secret: crypto.randomBytes(16).toString('hex'),
        token: crypto.randomBytes(24).toString('hex'),
      },
    });

    return { user, auth };
  }

  // Function to change the password (this is unchanged)
  async changePassword(id: string, password: string): Promise<object> {
    const salt = genSaltSync(10);
    const hashed = await hash(password, salt); // Hash the new password

    // Update the password in the database
    await this.prisma.eCH_Auth.update({
      where: { userId: id },
      data: { password: hashed },
    });

    return { message: 'User Password has been updated' };
  }

  // Function to update user and auth details
  async updateUserWithAuth(
    userId: string,
    userData: {
      firstName: string;
      email: string;
      contact: string;
      password?: string; // Password is optional because it might not be updated every time
    },
  ) {
    // Check if user exists
    const user = await this.prisma.eCH_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Begin a transaction to ensure consistency
    const transactionResult = await this.prisma.$transaction(async (prisma) => {
      // Update user information
      const updatedUser = await prisma.eCH_User.update({
        where: { id: userId },
        data: {
          firstName: userData.firstName,
          email: userData.email,
          contact: userData.contact,
        },
      });

      // If password is provided, hash it and update auth details
      if (userData.password) {
        const salt = genSaltSync(10);
        const hashedPassword = await hash(userData.password, salt);

        // Update the authentication credentials
        await prisma.eCH_Auth.update({
          where: { userId: userId },
          data: { password: hashedPassword, username: userData.firstName },
        });
      }

      // Fetch the updated auth details
      const auth = await prisma.eCH_Auth.findUnique({
        where: { userId: userId },
      });

      return { user: updatedUser, auth };
    });

    // Return the result of the transaction
    return transactionResult;
  }

  async login(user: any, response: Response) {
    const payload = { username: user.username, sub: user.userId };
    const token = this.jwtService.sign(payload); // Generate JWT token

    // Update the token in the database
    await this.prisma.eCH_Auth.update({
      where: { userId: user.userId },
      data: { token },
    });

    // Set the token as an HttpOnly cookie
    response.cookie('jwt', token, {
      domain: 'localhost', // This allows the cookie to be shared across subdomains like localhost:8080 and localhost:5000
      path: '/',
      sameSite: 'none', // Necessary for cross-origin requests
      httpOnly: true, // Make the cookie inaccessible via JavaScript (security)
      secure: process.env.NODE_ENV === 'production', // Set to true only in production if using HTTPS
      maxAge: 3600000, // 1 hour expiration
    });

    response.cookie('jwt', token, {
      domain: 'Candent04', // This allows the cookie to be shared across subdomains like localhost:8080 and localhost:5000
      path: '/',
      sameSite: 'none', // Necessary for cross-origin requests
      httpOnly: true, // Make the cookie inaccessible via JavaScript (security)
      secure: process.env.NODE_ENV === 'production', // Set to true only in production if using HTTPS
      maxAge: 3600000, // 1 hour expiration
    });

    response.cookie('jwt', token, {
      domain: 'JDSquare', // This allows the cookie to be shared across subdomains like localhost:8080 and localhost:5000
      path: '/',
      sameSite: 'none', // Necessary for cross-origin requests
      httpOnly: true, // Make the cookie inaccessible via JavaScript (security)
      secure: process.env.NODE_ENV === 'production', // Set to true only in production if using HTTPS
      maxAge: 3600000, // 1 hour expiration
    });

    return { message: 'Login successful', statusCode: HttpStatus.OK };
  }

  // getUserById(userId: string) {
  //   const user = this.prisma.eCH_Auth.findFirst({ where: { id: userId } });
  //   return user;
  // }

  async getUserById(userId: any) {
    return this.prisma.eCH_Auth.findUnique({
      where: { id: userId },
      select: { id: true, username: true, userId: true, user: true },
    });
  }

  // Validate user credentials
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.eCH_Auth.findUnique({
      where: { username },
    });

    // Check if user was found and has a password
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // const { password, ...result } = user;
        // return result;
        return user; // Return user if the password matches
      }
    }

    return null; // Return null if user not found or password doesn't match
  }

  async logout(response: Response) {
    response.clearCookie('jwt');
    response.clearCookie('authToken'); // Clear the JWT cookie on logout
    return { message: 'Logout successful' };
  }

  // async deleteUser(id: string): Promise<boolean> {
  //   // Find the auth record associated with the user
  //   const authRecord = await this.prisma.eCH_Auth.findUnique({
  //     where: { userId: id },
  //   });

  //   console.log('Auth Record Found:', authRecord); // Add logging

  //   if (!authRecord) {
  //     return false; // Return false if no auth record is found
  //   }

  //   // Delete the auth record
  //   await this.prisma.eCH_Auth.delete({
  //     where: { userId: id },
  //   });

  //   console.log('Auth Record Deleted');

  //   // Delete the user record
  //   await this.prisma.eCH_User.delete({
  //     where: { id: id },
  //   });

  //   console.log('User Record Deleted');

  //   return true; // Successfully deleted user and auth details
  // }

  async deleteAuthAndUserByUserId(userId: string): Promise<any> {
    // First, find the auth record using the userId
    const authRecord = await this.prisma.eCH_Auth.findUnique({
      where: { userId: userId },
    });

    if (!authRecord) {
      throw new Error('Auth record not found for userId');
    }

    // Start a transaction to delete both the auth and the user record
    await this.prisma.$transaction([
      // First delete the auth record
      this.prisma.eCH_Auth.delete({
        where: { id: authRecord.id },
      }),
      // Then delete the user record
      this.prisma.eCH_User.delete({
        where: { id: userId },
      }),
    ]);

    return {
      message: 'User and auth deleted successfully',
      userId: userId,
    };
  }
}
