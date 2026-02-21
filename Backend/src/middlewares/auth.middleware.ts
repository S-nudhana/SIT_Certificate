import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

import { TokenData } from "../types/jwt.type";
import { findUserRoleById } from "../models/user.model";
import { verifyToken } from "../utils/jwt";

export default function authMiddleware(requiredRoles: string[] = []) {
    return async (c: Context, next: Next) => {
        try {
            const COOKIE_SECRET = process.env.COOKIE_SECRET
            if (!COOKIE_SECRET) {
                throw new Error("Cookie Secret is not set")
            }

            const session = await getSignedCookie(c, COOKIE_SECRET, 'session')
            if (!session) {
                return c.json({ authorized: false, message: "Unauthorized" }, 401)
            }

            const tokenData: TokenData | null = await verifyToken(session)
            if (!tokenData) {
                return c.json({ authorized: false, message: "Unauthorized" }, 401)
            }

            const userRole = await findUserRoleById(tokenData.uid)
            if (!userRole || !requiredRoles.includes(userRole.userRole)) {
                return c.json({ authorized: false, message: "Unauthorized" }, 401)
            }
            await next()
        } catch (error) {
            console.error(error)
            return c.json({ authorized: false, message: "Internal Server Error" }, 500)
        }
    }
}