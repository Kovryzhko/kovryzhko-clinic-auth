import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name)

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL!,
        })
        super({ adapter })
    }

    public async onModuleInit() {
        await this.$connect()

        this.logger.log('database connect')
    }

    public async onModuleDestroy() {
        await this.$disconnect()

        this.logger.log("database disconnect")
    }
}
