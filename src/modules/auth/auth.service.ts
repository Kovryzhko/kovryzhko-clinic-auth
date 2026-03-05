import { Injectable } from '@nestjs/common';
import { RefreshRequest, SendOtpRequest, VerifyOtpRequest } from 'kovryzhko-clinic-contracts/gen/auth';
import { OtpService } from '../otp/otp.service';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'kovryzhko-clinic-common/dist/rpc-status.enum';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { TokensService } from '../tokens/tokens.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly otpService: OtpService,
        private readonly userRepository: UserRepository,
        private readonly tokensService: TokensService,
        private readonly messagesService: MessagesService,
    ) { }

    public async sendOtp(data: SendOtpRequest) {
        let account = await this.userRepository.findByPhoneOrEmail(data)

        if (!account) account = await this.userRepository.createAccount({
            email: data.type === 'email' ? data.identifier : undefined,
            phone: data.type === 'phone' ? data.identifier : undefined
        })

        const type = data.type as 'email' | 'phone'

        const code = await this.otpService.send(data.identifier, type)

        await this.messagesService.otpRequest({
            identifier: data.identifier,
            code: code.code,
            type,
        })

        return { ok: true }
    }

    public async verifyOtp(data: VerifyOtpRequest) {
        await this.otpService.verify(data.identifier, data.code, data.type as 'email' | 'phone')

        const account = await this.userRepository.findByPhoneOrEmail(data)

        if (!account) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Account not found' })

        if (data.type === 'phone' && !account.isPhoneVerified) {
            await this.userRepository.update(account.id, {
                isPhoneVerified: true
            })
        }

        if (data.type === 'email' && !account.isEmailVerified) {
            await this.userRepository.update(account.id, {
                isEmailVerified: true
            })
        }

        const tokens = this.tokensService.generateAuthTokens({ deviceId: "test", userId: account.id })

        return tokens
    }

    public async refresh(data: RefreshRequest) {
        const { refreshToken } = data

        const { userId, deviceId } = this.tokensService.validateToken(refreshToken)

        return this.tokensService.generateAuthTokens({ userId, deviceId })
    }
}
