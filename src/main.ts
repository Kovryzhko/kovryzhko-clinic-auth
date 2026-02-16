import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createGrpcServer } from './modules/grpc/grpc.server';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    createGrpcServer(app)

    await app.startAllMicroservices()
    await app.init()
}
bootstrap();
