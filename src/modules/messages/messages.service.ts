import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OtpRequestEvent, EmailChangedEvent, PhoneChangedEvent, AccountChangedNotify } from 'kovryzhko-clinic-contracts';

@Injectable()
export class MessagesService {
    constructor(private readonly amqpConnection: AmqpConnection) { }

    public async otpRequest(message: OtpRequestEvent) {
        await this.amqpConnection.publish(
            'auth',
            'auth.otp.request',
            message,
        );
    }

    public async emailChange(message: EmailChangedEvent) {
        await this.amqpConnection.publish(
            'account',
            'account.email.change',
            message,
        );
    }

    public async phoneChange(message: PhoneChangedEvent) {
        await this.amqpConnection.publish(
            'account',
            'account.phone.change',
            message,
        );
    }

    public async accountSettingsChangeNotify(message: AccountChangedNotify) {
        await this.amqpConnection.publish(
            'account',
            'account.settings-change.notify',
            message,
        );
    }
}
