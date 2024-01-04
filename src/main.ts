import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';
import { ExchangeService } from './exchange/exchange.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();
const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    const config = new DocumentBuilder()
      .setTitle('API de conversión de monedas')
      .setDescription('API de conversión de monedas')
      .setVersion('1.0')
      .addTag('exchange')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalFilters(new GlobalExceptionFilter());
    const port = process.env.PORT || 3000;
    const exchangeService = app.get(ExchangeService);
    await exchangeService.seedExchangeRates();
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error during application startup', error);
  }
}
bootstrap();
