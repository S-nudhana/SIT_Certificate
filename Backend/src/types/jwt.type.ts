export interface TokenData {
    uid: string,
    role: string,
    exp: number
}

export interface SignTokenPayload {
    user_id: string,
    user_role: string
}

export interface VerifyTokenPayload {
    token: string
}