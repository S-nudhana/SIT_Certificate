import { sign, verify } from 'hono/jwt'

import { TokenData, SignTokenPayload, VerifyTokenPayload } from '../types/jwt.type'

export async function signToken(signTokenPayload: SignTokenPayload): Promise<string> {
    const JWT_SECRET = Bun.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }
    return await sign({
        uid: signTokenPayload.user_id,
        role: signTokenPayload.user_role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }, JWT_SECRET, 'HS256')
}

export async function verifyToken(verifyTokenPayload: VerifyTokenPayload): Promise<TokenData | null> {
    const JWT_SECRET = Bun.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined')
    }

    try {
        const payload = await verify(verifyTokenPayload.token, JWT_SECRET, 'HS256')
        if (typeof payload !== 'object' || payload === null || typeof payload.uid !== 'string' || typeof payload.role !== 'string') {
            return null
        }
        return payload as unknown as TokenData
    } catch {
        return null
    }
}