import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ensure this is the correct path

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  // Fetch all applications
  async getAllApplications() {
    return this.prisma.eCH_Application.findFirst({
      include: {
        permission: true, // Include related permissions if needed
      },
    });
  }
}
