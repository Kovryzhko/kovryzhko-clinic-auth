import { createHash } from "node:crypto";

export function generateOtpCode(code: string) {
    const hash = createHash('sha256').update(code).digest('hex')
    return hash
}