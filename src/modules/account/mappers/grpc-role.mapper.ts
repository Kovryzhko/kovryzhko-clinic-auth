// import { Role as ContractRole } from "kovryzhko-clinic-contracts/gen/account";
// import { Role as PrismaRole } from "prisma/generated/enums";


// TODO: fix types
/////////////////

export const PrismaRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

export type PrismaRole = (typeof PrismaRole)[keyof typeof PrismaRole]

export enum ContractRole {
  USER = 0,
  ADMIN = 1,
  UNRECOGNIZED = -1,
}

/////////////////

const roleMapper: Record<PrismaRole, ContractRole> = {
    [PrismaRole.USER]: ContractRole.USER,
    [PrismaRole.ADMIN]: ContractRole.ADMIN,
};

export function grpcAccountRoleMapper(prismaRole: PrismaRole) {
    return roleMapper[prismaRole];
}