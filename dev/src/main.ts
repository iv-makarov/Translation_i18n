import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { MikroORM } from '@mikro-orm/sqlite';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize database schema
  const orm = app.get(MikroORM);
  await orm.getSchemaGenerator().updateSchema();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Translation API')
    .setDescription('The translation API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
