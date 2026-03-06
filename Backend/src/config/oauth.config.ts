import { googleAuth } from "@hono/oauth-providers/google"

export const oauthGoogleConfig = googleAuth({
    client_id: Bun.env.GOOGLE_CLIENT_ID!,
    client_secret: Bun.env.GOOGLE_CLIENT_SECRET!,
    scope: ["openid", "email", "profile"],
})