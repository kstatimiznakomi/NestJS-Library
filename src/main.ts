import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

var cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('The NestJS Libre Backend API')
    .setDescription('The NestJS Libre Backend API')
    .setVersion('0.1')
    .build();

  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed methods
    credentials: true, // Allow credentials (e.g., cookies)
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'], // Allowed headers
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
    ],
  });


  await app.listen(process.env.PORT);
}

bootstrap();
