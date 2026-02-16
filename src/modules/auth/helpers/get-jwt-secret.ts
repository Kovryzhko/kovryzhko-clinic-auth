import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "kovryzhko-clinic-common/dist/rpc-status.enum";

export function getJwtSecret() {
    const secret = process.env.JWT_SECRET

    if (!secret) throw new RpcException({ code: RpcStatus.INTERNAL, details: 'internal error' })

    return secret
}