import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Updated CORS options
  const corsOptions: CorsOptions = {
    origin: ['*'], // Replace with exact URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in requests
    exposedHeaders: ['Set-Cookie'], // Headers exposed to the client
    credentials: true, // Allow cookies
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  // Session setup
  app.use(
    session({
      secret: 'JWT_SECRET', // Replace with your own secret key
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something is stored
      cookie: {
        httpOnly: true, // Prevents client-side access
        secure: false, // Set to `true` in production with HTTPS
        maxAge: 1000 * 60 * 30, // 30 minutes
      },
    }),
  );

  // Enable cookie parsing
  app.use(cookieParser());

  // Start the application
  await app.listen(5000);
}

bootstrap();
