export function generateOtpRedisKey(identifier: string, type: 'phone' | 'email') {
    const result = `otp:${type}:${identifier}`
    return result
}