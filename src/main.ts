import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createGrpcServer } from './modules/grpc/grpc.server';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.get(ConfigService);

    createGrpcServer(app)

    await app.startAllMicroservices()
    await app.init()
}
bootstrap();
