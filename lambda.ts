import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { createServer, proxy } from 'aws-serverless-express';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);
let server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  await app.init();
  server = createServer(expressApp);
}

bootstrap();

export const handler = (event, context) => proxy(server, event, context);
