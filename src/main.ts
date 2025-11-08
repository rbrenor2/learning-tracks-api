import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function setupOpenApi(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Learning Tracks API')
    .setDescription('This is the API that serves the Learning Tracks app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupOpenApi(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
