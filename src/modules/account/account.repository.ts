import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IUpsertPendingChange } from "./account.typings";

@Injectable()
export class AccountRepository {
    constructor(private readonly prismaService: PrismaService) { }

    public findById(id: string) {
        return this.prismaService.account.findUnique({
            where: {
                id
            }
        })
    }

    public async findPendingChange(accountId: string, type: 'email' | 'phone') {
        return await this.prismaService.pendingContactChange.findUnique({
            where: {
                accountId_type: {
                    accountId,
                    type,
                }
            }
        })
    }

    public async upsertPendingChange(data: IUpsertPendingChange) {
        return await this.prismaService.pendingContactChange.upsert({
            where: {
                accountId_type: {
                    accountId: data.accountId,
                    type: data.type,
                }
            },
            create: data,
            update: data,
        })
    }

    public async deletePendingChange(accountId: string, type: 'email' | 'phone') {
        return await this.prismaService.pendingContactChange.delete({
            where: {
                accountId_type: {
                    accountId,
                    type,
                }
            }
        })
    }
}