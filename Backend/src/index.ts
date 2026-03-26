import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { serveStatic } from 'hono/bun'
import 'dotenv/config'

import { corsConfig } from './config/cors.config'
import { rateLimiterConfig } from './config/rateLimiter.config'

import user from './routes/user.route'
import event from './routes/event.route'
import certificate from './routes/certificate.route'

const app = new OpenAPIHono()

app.use('*', secureHeaders({
  crossOriginResourcePolicy: 'cross-origin',
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
  },
  xXssProtection: '1; mode=block',
  xDnsPrefetchControl: 'off',
}))
app.use('*', corsConfig)
app.use('*', rateLimiterConfig)
app.use('*', logger())

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running'
  })
})

app.use('/uploads/*', serveStatic({ root: './' }))

app.route('/api/user', user)
app.route('/api/event', event)
app.route('/api/certificate', certificate)

if (Bun.env.NODE_ENV !== 'production') {
  app.doc('/api/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Certificate API',
      version: '1.0.0'
    }
  })

  app.get('/api/swagger', swaggerUI({ url: '/api/doc' }))
}

export default {
  port: Bun.env.PORT || 3001,
  fetch: app.fetch,
}