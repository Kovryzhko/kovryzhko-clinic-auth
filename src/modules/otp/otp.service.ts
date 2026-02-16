import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { faker } from '@faker-js/faker';
import { RpcException } from '@nestjs/microservices';
import { generateOtpCode } from './utils/generate-code';
import { generateOtpRedisKey } from './utils/generate-redis-key';
import { RpcStatus } from 'kovryzhko-clinic-common/dist/rpc-status.enum';

@Injectable()
export class OtpService {
    constructor(private readonly redisService: RedisService) {
    }

    public async send(identifier: string, type: 'phone' | 'email') {
        const { code, hash } = this.generateCode()

        const redisKey = generateOtpRedisKey(identifier, type)

        await this.redisService.set(redisKey, hash, "EX", 600)

        return { code }
    }

    private generateCode(length: number = 6) {
        const code = faker.string.numeric(length)

        const hash = generateOtpCode(code)

        return { code, hash }
    }

    public async verify(identifier: string, code: string, type: 'phone' | 'email') {
        const storedHash = await this.redisService.get(`otp:${type}:${identifier}`)

        if (!storedHash) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Invalid code' })

        const hash = generateOtpCode(code)

        if (storedHash != hash) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Invalid code' })

        const redisKey = generateOtpRedisKey(identifier, type)
        await this.redisService.del(redisKey)
    }
}
