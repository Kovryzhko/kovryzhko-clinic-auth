import { Injectable } from '@nestjs/common';
import { RefreshRequest, SendOtpRequest, VerifyOtpRequest } from 'kovryzhko-clinic-contracts/gen/auth';
import { AuthRepository } from './auth.repository';
import { OtpService } from '../otp/otp.service';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'kovryzhko-clinic-common/dist/rpc-status.enum';
import { AuthTokenService } from './services/tokens.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly otpService: OtpService,
        private readonly authTokenService: AuthTokenService,
    ) { }

    public async sendOtp(data: SendOtpRequest) {
        let account = await this.authRepository.findByPhoneOrEmail(data)

        if (!account) account = await this.authRepository.createAccount({
            email: data.type === 'email' ? data.identifier : undefined,
            phone: data.type === 'phone' ? data.identifier : undefined
        })

        const code = await this.otpService.send(data.identifier, data.type as 'email' | 'phone')
        console.log(code)
        return { ok: true }
    }

    public async verifyOtp(data: VerifyOtpRequest) {
        await this.otpService.verify(data.identifier, data.code, data.type as 'email' | 'phone')

        const account = await this.authRepository.findByPhoneOrEmail(data)

        if (!account) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Account not found' })

        if (data.type === 'phone' && !account.isPhoneVerified) {
            await this.authRepository.update(account.id, {
                isPhoneVerified: true
            })
        }

        if (data.type === 'email' && !account.isEmailVerified) {
            await this.authRepository.update(account.id, {
                isEmailVerified: true
            })
        }

        const tokens = this.authTokenService.generateAuthTokens({ deviceId: "test", userId: account.id })

        return tokens
    }

    public async refresh(data: RefreshRequest) {
        const { refreshToken } = data

        const { userId, deviceId } = this.authTokenService.validateToken(refreshToken)

        return this.authTokenService.generateAuthTokens({ userId, deviceId })
    }
}
