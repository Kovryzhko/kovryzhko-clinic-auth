import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpService } from '../otp/otp.service';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { TokensModule } from '../tokens/tokens.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
    imports: [TokensModule, MessagesModule],
    controllers: [AuthController],
    providers: [AuthService, OtpService, UserRepository],
    exports: []
})
export class AuthModule { }
