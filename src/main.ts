import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('Personal finance tracking REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  if (process.env.NODE_ENV !== 'production') {
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, documentFactory);
  }
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
