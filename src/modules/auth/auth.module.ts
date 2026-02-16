import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { OtpService } from '../otp/otp.service';
import { AuthTokenService } from './services/tokens.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, OtpService, AuthTokenService],
})
export class AuthModule { }
