import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import { ConfirmEmailChangeRequest, ConfirmEmailChangeResponse, ConfirmPhoneChangeRequest, ConfirmPhoneChangeResponse, GetAccountRequest, GetAccountResponse, InitEmailChangeRequest, InitEmailChangeResponse, InitPhoneChangeRequest, InitPhoneChangeResponse } from 'kovryzhko-clinic-contracts/gen/account'
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @GrpcMethod('AccountService', 'GetAccount')
    public async getAccount(data: GetAccountRequest): Promise<GetAccountResponse> {
        const account = await this.accountService.getAccount(data)
        // TODO: fix type
        return account as unknown as GetAccountResponse
    }

    @GrpcMethod('AccountService', 'InitEmailChange')
    public async initEmailChange(data: InitEmailChangeRequest): Promise<InitEmailChangeResponse> {
        const ok = await this.accountService.initEmailChange(data)
        return ok
    }

    @GrpcMethod('AccountService', 'ConfirmEmailChange')
    public async confirmEmailChange(data: ConfirmEmailChangeRequest): Promise<ConfirmEmailChangeResponse> {
        const ok = await this.accountService.confirmEmailChange(data)
        return ok
    }

    @GrpcMethod('AccountService', 'InitPhoneChange')
    public async initPhoneChange(data: InitPhoneChangeRequest): Promise<InitPhoneChangeResponse> {
        const ok = await this.accountService.initPhoneChange(data)
        return ok
    }

    @GrpcMethod('AccountService', 'ConfirmPhoneChange')
    public async confirmPhoneChange(data: ConfirmPhoneChangeRequest): Promise<ConfirmPhoneChangeResponse> {
        const ok = await this.accountService.confirmPhoneChange(data)
        return ok
    }
}
