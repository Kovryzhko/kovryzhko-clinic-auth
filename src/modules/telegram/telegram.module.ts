import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegramRepository } from './telegram.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TokensModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramRepository, UserRepository],
})
export class TelegramModule { }
