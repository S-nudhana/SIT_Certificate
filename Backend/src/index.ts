import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { rateLimiter } from 'hono-rate-limiter'
import { secureHeaders } from 'hono/secure-headers'

import { corsConfig } from './config/cors.config';

import user from './routes/user.route';
import event from './routes/event.route';

const app = new Hono()

app.use('*', secureHeaders())
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

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running'
  })
})
app.route('/api/user', user)
app.route('/api/event', event)

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
}