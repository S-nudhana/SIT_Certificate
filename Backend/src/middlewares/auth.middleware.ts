import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

import { TokenData } from "../types/jwt.type";
import { UserRoleResponse } from "../types/user.type";

import { findUserRoleById } from "../models/user.model";

import { verifyToken } from "../utils/jwt";

export default function authMiddleware(requiredRoles: string[] = []) {
    return async (c: Context, next: Next) => {
        try {
            const COOKIE_SECRET = Bun.env.COOKIE_SECRET
            if (!COOKIE_SECRET) {
                throw new Error("Cookie Secret is not set")
            }

            const session = await getSignedCookie(c, COOKIE_SECRET, 'session')
            if (!session) {
                return c.json(
                    { authorized: false, code: "NO_SESSION", message: "Unauthorized" },
                    401
                )
            }

            const tokenData: TokenData | null = await verifyToken({ token: session })
            if (!tokenData) {
                return c.json(
                    { authorized: false, code: "INVALID_SESSION", message: "Invalid session" },
                    401
                )
            }

            if (tokenData.exp < Math.floor(Date.now() / 1000)) {
                return c.json(
                    { authorized: false, code: "SESSION_EXPIRED", message: "Session expired" },
                    401
                )
            }

            const userRole: UserRoleResponse | null = await findUserRoleById(tokenData.uid)
            if (!userRole || !requiredRoles.includes(userRole.userRole)) {
                return c.json(
                    { authorized: false, code: "UNAUTHORIZED", message: "Unauthorized" },
                    401
                )
            }
            c.set('userData', tokenData);
            await next()
        } catch (error) {
            console.error(error)
            return c.json(
                { authorized: false, code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
                500
            )
        }
    }
}