export interface GenerateTokensData {
    userId: string
    deviceId: string
}

export interface IGenerateToken {
    userId: string,
    deviceId: string,
    type: TokenType
}

export enum TokenType {
    Access = 'access',
    Refresh = 'refresh'
}

export interface ITokenPayload {
    userId: string
    deviceId: string
}