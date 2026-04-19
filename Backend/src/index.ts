import { OpenAPIHono } from '@hono/zod-openapi'
import { Hono, Context } from 'hono'
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

const openapi = new OpenAPIHono()
const app = new Hono()

openapi.route('/user', user)
openapi.route('/event', event)
openapi.route('/certificate', certificate)

if (Bun.env.NODE_ENV !== 'production') {
  openapi.doc('/doc', {
    openapi: '3.0.0',
    info: { title: 'Certificate API', version: '1.0.0' }
  })
  app.get('/swagger', swaggerUI({ url: '/api/doc' }))
}

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

app.get('/api/health', (c: Context) => c.json({ status: 'ok', message: 'API is running' }))
app.use('/uploads/*', serveStatic({
  root: './uploads',
  rewriteRequestPath: (path) => path.replace(/^\/uploads/, '')
}))

app.route('/api', openapi)

export default {
  port: Bun.env.PORT || 3001,
  fetch: app.fetch,
}