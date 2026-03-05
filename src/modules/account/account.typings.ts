export interface IUpsertPendingChange {
    accountId: string, type: 'email' | 'phone',
    value: string,
    codeHash: string,
    expiresAt: Date
}