import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name)

    constructor() {
        super({
            password: process.env.REDIS_PASSWORD,
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379'),

            maxRetriesPerRequest: 3,
            enableOfflineQueue: true,
        })
    }

    public async onModuleInit() {
        this.on('connect', () => this.logger.log('Redis connect'))

        this.on('ready', () => this.logger.log('Redis ready'))

        this.on('error', (error) => this.logger.error(error))

        this.on('close', () => this.logger.log('Redis disconnect'))
    }

    public async onModuleDestroy() {
        await this.quit()

        this.logger.log('Redis disconnect')
    }
}
