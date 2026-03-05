import * as jwt from 'jsonwebtoken'
import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "kovryzhko-clinic-common/dist/rpc-status.enum";
import { GenerateTokensData, IGenerateToken, ITokenPayload, TokenType } from './tokens.typings';
import { getJwtSecret } from './helpers/get-jwt-secret';
import { isValidTokenPayload } from '../auth/validators/is-valid-token-payload';

export class TokensService {
    public generateAuthTokens(data: GenerateTokensData) {

        const accessTokenData = this.generateToken({ ...data, type: TokenType.Access })
        const refreshTokenData = this.generateToken({ ...data, type: TokenType.Refresh })

        return {
            accessToken: accessTokenData,
            refreshToken: refreshTokenData,
        };
    };

    public generateToken(data: IGenerateToken) {
        const expiresIn = data.type == TokenType.Access ? process.env.ACCESS_TOKEN_EXPIRES : process.env.REFRESH_TOKEN_EXPIRES

        const payload: ITokenPayload = { userId: data.userId, deviceId: data.deviceId }

        const token = jwt.sign(
            payload,
            getJwtSecret(),
            { expiresIn: Number(expiresIn) }
        );

        return token
    }

    public validateToken(token: string): ITokenPayload {
        try {
            const payload = jwt.verify(token, getJwtSecret())

            if (!isValidTokenPayload(payload)) throw new RpcException({ code: RpcStatus.INTERNAL, details: 'Internal error' })

            return payload
        } catch (error) {
            if (error instanceof RpcException) throw error

            throw new RpcException({ code: RpcStatus.UNAUTHENTICATED, details: 'Invalid token' })
        }
    }
}