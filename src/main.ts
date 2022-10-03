import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import moment from 'moment';
import { AppModule } from './app.module';
import 'moment/locale/ru'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  // moment.locale("ru",require('moment/locale/ru'))
  await app.listen(3000,"0.0.0.0",(_,a)=>console.log(a));
}
bootstrap();
