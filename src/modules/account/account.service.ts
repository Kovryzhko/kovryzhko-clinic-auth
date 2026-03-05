import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from 'kovryzhko-clinic-common/dist/rpc-status.enum';
import { grpcAccountRoleMapper } from './mappers/grpc-role.mapper';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { OtpService } from '../otp/otp.service';
import { ConfirmEmailChangeRequest, ConfirmPhoneChangeRequest, GetAccountRequest, InitEmailChangeRequest, InitPhoneChangeRequest } from 'kovryzhko-clinic-contracts/gen/account';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly userRepository: UserRepository,
        private readonly otpService: OtpService,
        private readonly messagesService: MessagesService,
    ) { }
    public async getAccount(data: GetAccountRequest) {
        const account = await this.accountRepository.findById(data.id)

        if (!account) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: "Account not found" })

        return {
            id: account.id,
            phone: account.phone ?? '',
            email: account.email ?? '',
            isPhoneVerified: account.isPhoneVerified,
            isEmailVerified: account.isEmailVerified,
            role: grpcAccountRoleMapper(account.role),
        }
    }

    public async initEmailChange(data: InitEmailChangeRequest) {
        const { email, userId } = data

        const exist = await this.userRepository.findByEmail(email)

        if (exist) throw new RpcException({ code: RpcStatus.ALREADY_EXISTS, details: 'Email already exists' })

        const { code, hash } = await this.otpService.send(email, 'email')

        this.accountRepository.upsertPendingChange({
            accountId: userId,
            type: 'email',
            value: email,
            codeHash: hash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })

        await this.messagesService.emailChange({
            email,
            code
        })

        return { ok: true }
    }

    public async confirmEmailChange(data: ConfirmEmailChangeRequest) {
        const { email, code, userId } = data

        const pending = await this.accountRepository.findPendingChange(userId, 'email')

        if (!pending) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Not found pending request' })

        if (pending.value !== email) throw new RpcException({ code: RpcStatus.INVALID_ARGUMENT, details: 'Email mismatch' })

        if (pending.expiresAt < new Date()) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Code expired' })

        this.otpService.verify(pending.value, code, 'email')

        const user = await this.userRepository.findById(userId)

        await this.userRepository.update(userId, {
            email,
            isEmailVerified: true,
        })

        await this.accountRepository.deletePendingChange(userId, 'email')

        if (user && user.email) await this.messagesService.accountSettingsChangeNotify({ email: user.email })

        return { ok: true }
    }

    public async initPhoneChange(data: InitPhoneChangeRequest) {
        const { phone, userId } = data

        const exist = await this.userRepository.findByPhone(phone)

        if (exist) throw new RpcException({ code: RpcStatus.ALREADY_EXISTS, details: 'Phone already exists' })

        const { code, hash } = await this.otpService.send(phone, 'phone')

        this.accountRepository.upsertPendingChange({
            accountId: userId,
            type: 'phone',
            value: phone,
            codeHash: hash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })

        await this.messagesService.phoneChange({
            phone,
            code
        })

        return { ok: true }
    }

    public async confirmPhoneChange(data: ConfirmPhoneChangeRequest) {
        const { phone, code, userId } = data

        const pending = await this.accountRepository.findPendingChange(userId, 'phone')

        if (!pending) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Not found pending request' })

        if (pending.value !== phone) throw new RpcException({ code: RpcStatus.INVALID_ARGUMENT, details: 'Phone mismatch' })

        if (pending.expiresAt < new Date()) throw new RpcException({ code: RpcStatus.NOT_FOUND, details: 'Code expired' })

        this.otpService.verify(pending.value, code, 'phone')

        const user = await this.userRepository.update(userId, {
            phone,
            isPhoneVerified: true,
        })

        await this.accountRepository.deletePendingChange(userId, 'phone')

        if (user.email) await this.messagesService.accountSettingsChangeNotify({ email: user.email })

        return { ok: true }
    }
}
