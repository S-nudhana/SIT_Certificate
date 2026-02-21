import { cors } from 'hono/cors'

export const corsConfig = cors({
    origin: (origin) => {
        const allowedOrigins = [
            'http://localhost:5173'
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