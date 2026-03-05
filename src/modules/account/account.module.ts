import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { OtpService } from '../otp/otp.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
    imports: [MessagesModule],
    controllers: [AccountController],
    providers: [AccountService, AccountRepository, UserRepository, OtpService],
})
export class AccountModule { }
