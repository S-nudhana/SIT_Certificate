import { Context } from "hono";
import { getSignedCookie } from "hono/cookie";

import { TokenData } from "../../types/jwt.type";
import { findUserRoleById } from "../../models/user.model";
import { verifyToken } from "../../utils/jwt";

export default async function authorize(c: Context) {
    try {
        const COOKIE_SECRET = process.env.COOKIE_SECRET
        if (!COOKIE_SECRET) {
            throw new Error("Cookie Secret is not set")
        }

        const session = await getSignedCookie(c, COOKIE_SECRET, 'session')
        if (!session) {
            return c.json({ data: { authorized: false, role: null }, message: "Unauthorized" }, 401)
        }

        const tokenData: TokenData | null = await verifyToken(session)
        if (!tokenData) {
            return c.json({ data: { authorized: false, role: null }, message: "Unauthorized" }, 401)
        }

        const userData = await findUserRoleById(tokenData.uid)
        if (!userData) {
            return c.json({ data: { authorized: false, role: null }, message: "Unauthorized" }, 401)
        }
        return c.json({ data: { authorized: true, role: userData.userRole }, message: "Authorized" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ data: { authorized: false, role: null }, message: "Internal Server Error" }, 500)
    }
}