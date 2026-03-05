import { Injectable } from "@nestjs/common";
import { Account } from "prisma/generated/client";
import { AccountCreateInput, AccountUpdateInput } from "prisma/generated/models";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class UserRepository {

    constructor(private readonly prismaService: PrismaService) { }
    public async findById(id: string) {
        const account = await this.prismaService.account.findUnique({ where: { id } })

        return account
    }

    public async findByPhone(phone: string) {
        const account = await this.prismaService.account.findUnique({ where: { phone } })

        return account
    }

    public async findByEmail(email: string) {
        const account = await this.prismaService.account.findUnique({ where: { email } })

        return account
    }

    public async findByPhoneOrEmail(data: { identifier: string, type: string }) {
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

    public async createAccount(data: AccountCreateInput) {
        return await this.prismaService.account.create({ data })
    }
}