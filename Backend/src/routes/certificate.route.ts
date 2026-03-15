import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

import { apiResponse } from '../schemas/apiResponse.schema'
import authMiddleware from '../middlewares/auth.middleware'

import getEventCertificateGenerate from '../controllers/certificate/getCertificateGenerate.controller'
import getEventCertificateDownload from '../controllers/certificate/getCertificateDownload.controller'
import getEventCertificateSampleGenerate from '../controllers/certificate/getCertificateSampleGenerate.controller'

const certificate = new OpenAPIHono()
certificate.use('/{id}/certificate/*', authMiddleware(['admin', 'professor']))
const generateCertificateRoute = createRoute({
    method: 'get',
    path: '/{id}/certificate/generate',
    tags: ['Certificate'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Generate certificates'
        },
        500: {
            description: 'Internal Server Error'
        }
    }
})
certificate.openapi(generateCertificateRoute, getEventCertificateGenerate)

const downloadCertificateRoute = createRoute({
    method: 'get',
    path: '/{id}/certificate/download',
    tags: ['Certificate'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Download certificates',
            content: {
                'application/zip': {
                    schema: z.any()
                }
            }
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        },
        404: {
            description: 'No certificates found',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        }
    }
})
certificate.openapi(downloadCertificateRoute, getEventCertificateDownload)

const sampleCertificateRoute = createRoute({
    method: 'get',
    path: '/{id}/certificate/sample',
    tags: ['Certificate'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Generate sample certificate',
            content: {
                'application/pdf': {
                    schema: z.any()
                }
            }
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        },
        404: {
            description: 'Template not found',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(z.null())
                }
            }
        }
    }
})
certificate.openapi(sampleCertificateRoute, getEventCertificateSampleGenerate)
export default certificate