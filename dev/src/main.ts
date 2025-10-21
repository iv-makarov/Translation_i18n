import { MikroORM } from '@mikro-orm/sqlite';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie Parser - ВАЖНО для работы с cookies
  app.use(cookieParser());

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Временно отключаем для отладки
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS с настройками безопасности
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Initialize database schema
  const orm = app.get(MikroORM);
  await orm.getSchemaGenerator().updateSchema();

  // Swagger с настройками безопасности
  const config = new DocumentBuilder()
    .setTitle('Translation API')
    .setDescription('The translation API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/api.json',
  });

  // Start server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
