import { rateLimiter } from 'hono-rate-limiter'

export const rateLimiterConfig = rateLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    keyGenerator: (c) => {
      const forwarded = c.req.header('x-forwarded-for')
      return forwarded?.split(',')[0] || c.req.header('cf-connecting-ip') || 'unknown'
    },
    handler: (c) => {
      return c.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Try again later.'
        },
        429
      )
    }
  })