import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AccountCreateInput, AccountUpdateInput } from "prisma/generated/models";
import { SendOtpRequest } from "kovryzhko-clinic-contracts/gen/auth";
import { Account } from "prisma/generated/client";

@Injectable()
export class AuthRepository {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findByPhone(phone: string) {
        const account = await this.prismaService.account.findUnique({ where: { phone } })

        return account
    }

    public async findByEmail(email: string) {
        const account = await this.prismaService.account.findUnique({ where: { email } })

        return account
    }

    public async createAccount(data: AccountCreateInput) {
        return await this.prismaService.account.create({ data })
    }

    public async findByPhoneOrEmail(data: SendOtpRequest) {
        let account: Account | null = null
        if (data.type === 'email') account = await this.findByEmail(data.identifier)
        if (data.type === 'phone') account = await this.findByPhone(data.identifier)

        return account
    }

    public async update(id: string, data: AccountUpdateInput) {
        return await this.prismaService.account.update({
            where: {
                id
            },
            data
        })
    }
}