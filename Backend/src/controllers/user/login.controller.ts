import { Context } from "hono"
import { setSignedCookie, deleteCookie } from "hono/cookie"

import { signToken } from "../../utils/jwt"
import { findUserByEmail } from "../../models/user.model"

const CLIENT_URL = Bun.env.CLIENT_URL!
const COOKIE_SECRET = Bun.env.COOKIE_SECRET!

export default async function login(c: Context) {
  try {

    const user = c.get("user-google")

    if (!user?.email || !user?.id) {
      deleteCookie(c, "state")
      return c.redirect(`${CLIENT_URL}/login`)
    }

    const userData = await findUserByEmail(user.email)

    if (!userData) {
      deleteCookie(c, "state")
      return c.redirect(`${CLIENT_URL}/login`)
    }

    const token = await signToken({
      user_id: userData.user_id,
      user_role: userData.user_role
    })

    await setSignedCookie(c, "session", token, COOKIE_SECRET, {
      httpOnly: true,
      secure: Bun.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24
    })

    return c.redirect(CLIENT_URL)

  } catch (error) {
    console.error(error)
    return c.redirect(`${CLIENT_URL}/login`)
  }
}