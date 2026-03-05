import { Controller } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TelegramVerifyRequest, TelegramVerifyResponse } from 'kovryzhko-clinic-contracts/gen/auth';

@Controller()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) { }

  @GrpcMethod('AuthService', 'TelegramInit')
  public getAuthUrl() {
    return this.telegramService.getUrl();
  }

  @GrpcMethod('AuthService', 'TelegramVerify')
  public async verify(request: TelegramVerifyRequest): Promise<TelegramVerifyResponse> {
    return await this.telegramService.verify(request);
  }
}
