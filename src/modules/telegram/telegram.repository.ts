import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class TelegramRepository {
    public constructor(private readonly prisma: PrismaService) { }

    public async findByTelegramId(telegramId: string) {
        return this.prisma.account.findUnique({
            where: { telegramId }
        });
    }
}
