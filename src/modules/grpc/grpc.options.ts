import { PROTO_PATHS } from "kovryzhko-clinic-contracts"

export const grpcPackages = ['auth.v1', 'account.v1']

export const grpcProtoPaths = [PROTO_PATHS.AUTH, PROTO_PATHS.ACCOUNT]

export const grpcLoader = {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
}