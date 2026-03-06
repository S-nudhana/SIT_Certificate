import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { corsConfig } from './config/cors.config';
import { rateLimiterConfig } from './config/rateLimiter.config';

import user from './routes/user.route';
import event from './routes/event.route';

const app = new Hono()

app.use('*', secureHeaders())
app.use('*', corsConfig)
app.use('*', rateLimiterConfig)
app.use('*', logger())

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running'
  })
})
app.route('/api/user', user)
app.route('/api/event', event)

export default {
  port: Bun.env.PORT || 3001,
  fetch: app.fetch,
}