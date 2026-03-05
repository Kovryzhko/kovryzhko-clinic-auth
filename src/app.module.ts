import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { AccountModule } from './modules/account/account.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PrismaModule,
        RedisModule,
        OtpModule,
        AccountModule,
        TelegramModule,
        TokensModule,
        MessagesModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
