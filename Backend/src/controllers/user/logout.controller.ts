import { Context } from "hono";
import { deleteCookie } from "hono/cookie";

export default async function logout(c: Context) {
    try {
        const deletedSessionCookie = deleteCookie(c, 'session')
        const deletedStateCookie = deleteCookie(c, "state")
        if (!deletedSessionCookie || !deletedStateCookie) {
            return c.json({ message: "Logout Failed" }, 500)
        }
        return c.json({ message: "Logout Successfully" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error" }, 500)
    }
}