import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createGrpcServer } from './modules/grpc/grpc.server';
import { ConfigService } from '@nestjs/config';
import { startTracing } from './observe/tracing/tracing'

startTracing()

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.get(ConfigService);

    createGrpcServer(app)

    await app.startAllMicroservices()
    await app.listen(9101)
}
bootstrap();
