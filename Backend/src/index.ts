import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { rateLimiter } from 'hono-rate-limiter'
import { corsConfig } from './config/cors.config';

import user from './routes/user.route';

const app = new Hono()

app.use(corsConfig)
app.use(
  '*',
  rateLimiter({
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
)
app.use(logger())

app.route('/user', user)
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running'
  })
})

export default {
  port: 3001,
  fetch: app.fetch,
}