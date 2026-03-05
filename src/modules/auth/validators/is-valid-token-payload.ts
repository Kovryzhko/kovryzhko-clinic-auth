import { ITokenPayload } from "src/modules/tokens/tokens.typings";

export function isValidTokenPayload(payload: unknown): payload is ITokenPayload {
    return typeof payload === 'object'
        && payload !== null
        && ('userId' in payload || 'userUuid' in payload)
        && 'deviceId' in payload
        && typeof (payload as any).userId === 'string'
        && typeof (payload as any).deviceId === 'string';
}