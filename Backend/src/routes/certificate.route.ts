import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

import { apiResponse } from '../schemas/apiResponse.schema'
import authMiddleware from '../middlewares/auth.middleware'

import getCertificateGenerate from '../controllers/certificate/getCertificateGenerate.controller'
import getCertificateDownload from '../controllers/certificate/getCertificateDownload.controller'
import getCertificateSampleGenerate from '../controllers/certificate/getCertificateSampleGenerate.controller'
import getRegenerateCertificate from '../controllers/certificate/getCertificateRegenerate.controller'

const certificate = new OpenAPIHono()
const protectedCertificateMiddleware = authMiddleware(['ADMIN', 'PROFESSOR'])
const generateCertificateRoute = createRoute({
    method: 'get',
    path: '/{id}/generate',
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
certificate.openapi(generateCertificateRoute, getCertificateGenerate)

const downloadCertificateRoute = createRoute({
    method: 'get',
    path: '/{id}/download',
    tags: ['Certificate'],
    middleware: [protectedCertificateMiddleware],
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
certificate.openapi(downloadCertificateRoute, getCertificateDownload)

const sampleCertificateRoute = createRoute({
    method: 'post',
    path: '/sample',
    tags: ['Certificate'],
    request: {},
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
certificate.openapi(sampleCertificateRoute, getCertificateSampleGenerate)

const regenerateCertificateRoute = createRoute({
    method: 'get',
    path: '/regenerate/{id}',
    tags: ['Certificate'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Regenerate certificates'
        },
        500: {
            description: 'Internal Server Error'
        }
    }
})
certificate.openapi(regenerateCertificateRoute, getRegenerateCertificate)


export default certificate