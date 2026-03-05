import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'kovryzhko-clinic-common/dist/rpc-status.enum';
import { TelegramRepository } from './telegram.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { TokensService } from '../tokens/tokens.service';
import { TelegramVerifyRequest } from 'kovryzhko-clinic-contracts/gen/auth';
import { createHash, createHmac } from 'crypto';

@Injectable()
export class TelegramService {
    private readonly botId = process.env.TELEGRAM_BOT_ID;
    private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
    private readonly botUsername = process.env.TELEGRAM_BOT_USERNAME;
    private readonly redirectOrigin = process.env.TELEGRAM_REDIRECT_ORIGIN;

    constructor(
        private readonly telegramRepository: TelegramRepository,
        private readonly userRepository: UserRepository,
        private readonly tokensService: TokensService,
    ) {
        this.validateEnv();
    }

    public getUrl() {
        const url = new URL(`https://oauth.telegram.org/auth`);

        url.searchParams.append('bot_id', this.botId!)
        url.searchParams.append('origin', this.redirectOrigin!)
        url.searchParams.append('request_access', 'write')
        url.searchParams.append('return_to', this.redirectOrigin!)

        return { url: url.toString() }
    }

    public async verify(request: TelegramVerifyRequest) {
        const isValid = this.checkSignature(request.data);
        if (!isValid) throw new RpcException({ code: RpcStatus.UNAUTHENTICATED, message: 'Invalid signature' });

        const telegramId = request.data?.id;

        let account = await this.telegramRepository.findByTelegramId(telegramId);

        if (!account) account = await this.userRepository.createAccount({ telegramId })

        if (!account.isTelegramVerified) {
            await this.userRepository.update(account.id, { isTelegramVerified: true })
        }

        const tokens = this.tokensService.generateAuthTokens({ deviceId: "test", userId: account.id })
        return tokens
    }

    private validateEnv() {
        if (!this.botId || !this.botToken || !this.botUsername || !this.redirectOrigin) {
            throw new RpcException({ code: RpcStatus.INTERNAL, message: 'Telegram environment variables are not set' });
        }
    }

    private checkSignature(data: Record<string, string>) {
        const hash = data.hash;

        if (!hash) return false;

        const dataCheckString = Object.keys(data)
            .filter(key => key !== 'hash')
            .sort()
            .map(key => `${key}=${data[key]}`)
            .join('\n');

        const botToken = `${this.botId}:${this.botToken}`;

        const secretKey = createHash('sha256').update(botToken).digest();

        const hmac = createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        return hmac === hash;
    }
}
