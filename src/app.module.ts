import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';

@Module({
    imports: [AuthModule, PrismaModule, RedisModule, OtpModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
