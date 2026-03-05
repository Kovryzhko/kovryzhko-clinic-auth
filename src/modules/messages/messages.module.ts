import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          {
            name: 'auth',
            type: 'direct',
            createExchangeIfNotExists: true,
            options: { durable: true },
          },
          {
            name: 'account',
            type: 'direct',
            createExchangeIfNotExists: true,
            options: { durable: true },
          },
        ],
        uri: config.getOrThrow<string>('RMQ_URL'),
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule { }