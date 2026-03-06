import { cors } from 'hono/cors'

export const corsConfig = cors({
    origin: (origin) => {
        const allowedOrigins = [
            Bun.env.CLIENT_URL,
            Bun.env.GOOGLE_REDIRECT_URL
        ]
        if (origin && allowedOrigins.includes(origin)) {
            return origin
        }
        return ''
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})