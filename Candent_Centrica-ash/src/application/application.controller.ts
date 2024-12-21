import { Controller, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('/api/application') // This will expose the /application endpoint
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }
}
