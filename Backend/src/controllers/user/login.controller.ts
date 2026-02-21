import { Context } from "hono"
import { setSignedCookie } from "hono/cookie"

import { signToken } from "../../utils/jwt"

export default async function login(c: Context) {
  try {
    const body = await c.req.json()

    //signin method

    const user_id = "123456789"
    const user_role = "admin"

    const COOKIE_SECRET = process.env.COOKIE_SECRET
    if (!COOKIE_SECRET) {
      throw new Error("Cookie Secret is not set")
    }

    const token = await signToken(user_id, user_role)
    await setSignedCookie(c, 'session', token, COOKIE_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      path: '/',
      maxAge: 60 * 60 * 24
    })
    return c.json({ message: "Login Successfully" }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ message: "Internal Server Error" }, 500)
  }
}