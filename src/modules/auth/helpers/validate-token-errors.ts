import { RpcException } from "@nestjs/microservices"
import { RpcStatus } from "kovryzhko-clinic-common/dist/rpc-status.enum"
import * as jwt from 'jsonwebtoken'

export function validateTokenErrors(error: unknown): never {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) {
        throw new RpcException({
            code: RpcStatus.UNAUTHENTICATED,
            details: 'Token expired'
        })
    }
    if (error instanceof jwt.JsonWebTokenError) {
        throw new RpcException({
            code: RpcStatus.UNAUTHENTICATED,
            details: 'Invalid token'
        })
    }
    throw error
}