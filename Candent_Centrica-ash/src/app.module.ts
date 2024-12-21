import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { ApplicationModule } from './application/application.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationService } from './application/application.service';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    DatabaseModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    ApplicationModule,
  ],
  controllers: [AppController, ApplicationController],
  providers: [AppService, UserService, ApplicationService],
})
export class AppModule {}
