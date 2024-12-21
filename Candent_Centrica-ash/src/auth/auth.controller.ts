// import {
//   Controller,
//   Post,
//   Res,
//   Body,
//   HttpCode,
//   Get,
//   Logger,
//   Req,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { Request, Response } from 'express';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   @HttpCode(200)
//   async login(
//     @Body() loginDto: any,
//     @Req() req: Request, // Add request to access session
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     // Validate the user credentials
//     const user = await this.authService.validateUser(
//       loginDto.username,
//       loginDto.password,
//     );

//     // If user validation fails, return 401 Unauthorized
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Set user info in the session
//     req.session.user = { id: user.id, username: user.username };

//     // Return success response
//     return {
//       message: 'Logged in successfully',
//       user: req.session.user,
//       redirectTo: '/home',
//     };
//   }

//   @Get('whoami')
//   async whoami(@Req() req: Request) {
//     // Log the session data
//     Logger.log(JSON.stringify(req.session), 'AuthController');
//     Logger.log(JSON.stringify(req.cookies), 'AuthController');

//     // Check if user session exists
//     if (req.session.user) {
//       return { user: req.session.user };
//     } else {
//       return { message: 'Not logged in' };
//     }
//   }

//     });
//   @Post('logout')
//   async logout(@Req() req: Request, @Res() res: Response) {
//     // Destroy the session
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Logout failed' });
//       } else {
//         return { redirectTo: '/login' };
//         return res.json({ message: 'Logged out successfully' });
//       }
//   }
// }

import {
  Body,
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken'; // Import jwt for token generation
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Controller('/api/auth')
export class AuthController {
  jwtService: any;
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUserWithAuth(
    @Body()
    userData: {
      firstName: string;
      email: string;
      contact: string;
      createdBy: string;
      updatedBy: string;
      password: string;
      currentAddress: string;
      permanentAddress: string;
    },
  ) {
    return this.authService.createUserWithAuth(userData);
  }

  @Post('validate')
  validateToken(@Req() req): any {
    const token = req.cookies.authToken;

    if (!token) {
      throw new UnauthorizedException('No auth token provided.');
    }

    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, user: decoded }; // Return user details if token is valid
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body()
    userData: {
      firstName: string;
      email: string;
      contact: string;
      password?: string;
    },
  ) {
    try {
      const result = await this.authService.updateUserWithAuth(
        userId,
        userData,
      );
      return {
        message: 'User and authentication details updated successfully',
        result,
      };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: any,
    @Req() req: Request, // Access session
    @Res({ passthrough: true }) res: Response,
  ) {
    // Validate the user credentials
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // If user validation fails, return 401 Unauthorized
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Set user info in the session
    req.session.user = { id: user.id, username: user.username };

    // Generate a JWT token (replace 'your_jwt_secret' with your actual secret)
    const authToken = jwt.sign({ sub: user.id }, 'JWT_SECRET', {
      expiresIn: '1d',
    });

    // Set the JWT token as a cookie
    res.cookie('authToken', authToken, {
      httpOnly: true,
      sameSite: 'none',
      domain: '.localhost',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    // Set the JWT token as a cookie
    res.cookie('authToken', authToken, {
      httpOnly: true,
      sameSite: 'none',
      domain: '.candent04',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    // res.cookie('authToken', authToken, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   domain: 'candent04:8080',
    //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    //   maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    // });

    // Set the JWT token as a cookie
    res.cookie('authToken', authToken, {
      httpOnly: true,
      sameSite: 'none',
      domain: '.jdsquare',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    // Return success response
    return {
      message: 'Logged in successfully',
      user: req.session.user,
      authToken: authToken,
    };
  }

  @Get('whoami')
  async whoami(@Req() req: Request, @Res() res: Response) {
    try {
      // Log the session data and cookies
      Logger.log(JSON.stringify(req.session), 'AuthController');
      Logger.log(JSON.stringify(req.cookies), 'AuthController');

      // Check if user session exists
      if (req.session.user) {
        // Extract userId from session
        const userId = req.session.user.id;

        // Fetch user details by userId
        const user = await this.authService.getUserById(userId);

        // If user exists, return the user details
        if (user) {
          return res.json({ user });
        } else {
          // Return 401 if user is not found
          return res.status(401).json({ message: 'Invalid token' });
        }
      } else {
        // Return 401 if session is not found
        return res.status(401).json({ message: 'Not logged in' });
      }
    } catch (error) {
      // Catch any other error that occurs and handle it
      Logger.error('Error in whoami:', error);

      // Return 500 Internal Server Error for unexpected issues
      return res.status(500).json({
        message: 'An error occurred while processing your request',
        error: error.message,
      });
    }
  }

  @Get('transfer-user-data')
  async transferUserData(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not logged in' });
      }

      const userId = req.session.user.id;
      const userData = await this.authService.getUserById(userId);

      // Send user data to the other application (e.g., via a redirect)
      const destinationUrl = 'http://other-app.com/receive-data'; // Replace with the actual URL
      return res.redirect(
        `${destinationUrl}?userId=${userData.id}&username=${userData.username}`,
      );
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error transferring user data', error });
    }
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Logout failed' });
      }
      // Clear the cookie by name and set the same flags
      res.clearCookie('jwt', {
        httpOnly: true, // Ensure the cookie is HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        path: '/', // Ensure the path is correct
      });
      res.clearCookie('authToken', {
        httpOnly: true, // Ensure the cookie is HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        path: '/', // Ensure the path is correct
      });

      res.clearCookie('authToken', {
        httpOnly: true, // Ensure the cookie is HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        path: '/', // Ensure the path is correct
        domain: 'localhost:8080',
      });
      res.clearCookie('authToken', {
        httpOnly: true, // Ensure the cookie is HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        path: '/', // Ensure the path is correct
        domain: 'candent04:8081',
      });
      res.clearCookie('authToken', {
        httpOnly: true, // Ensure the cookie is HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        path: '/', // Ensure the path is correct
        domain: 'JDSquare:8080',
      });
      return res.send({ message: 'Logout successful' });
    });
  }

  // @Delete('delete/:id')
  // async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
  //   const result = await this.authService.deleteUser(id);

  //   if (result) {
  //     return {
  //       message:
  //         'User and their authentication details have been deleted successfully',
  //     };
  //   } else {
  //     return { message: 'User or authentication details not found' };
  //   }
  // }

  @Delete('delete/:id')
  async deleteAuthAndUser(@Param('id') userId: string) {
    try {
      const result = await this.authService.deleteAuthAndUserByUserId(userId);
      return {
        statusCode: 200,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error deleting user and auth',
        error: error.message,
      };
    }
  }
}
