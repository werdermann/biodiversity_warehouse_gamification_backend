import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createBaseData } from './app/app.bootstrap';

/**
 * Main entry point of the application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create the fake users
  await createBaseData(app);

  await app.listen(3000);
}
bootstrap();
