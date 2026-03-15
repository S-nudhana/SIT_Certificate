import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

import getEvents from '../controllers/event/getEvents.controller'
import getEvent from '../controllers/event/getEvent.controller'
import createEvent from '../controllers/event/createEvent.controller'
import updateEvent from '../controllers/event/updateEvent.controller'
import deleteEvent from '../controllers/event/deleteEvent.controller'
import getEventCertificateGenerate from '../controllers/certificate/getEventCertificateGenerate.controller'
import getEventCertificateDownload from '../controllers/certificate/getEventCertificateDownload.controller'

import authMiddleware from '../middlewares/auth.middleware'

import {
    createEventSchema,
    updateEventSchema
} from '../validators/event.validators'

import { apiResponse } from '../schemas/apiResponse.schema'
import {
    eventGetAllResponseSchema,
    eventGetByIDResponseSchema,
    eventCreateResponseSchema,
    eventUpdateResponseSchema
} from '../schemas/event.schema'

const event = new OpenAPIHono()

event.use('/', authMiddleware(['admin', 'professor']))
const getEventsRoute = createRoute({
    method: 'get',
    path: '/',
    tags: ['Event'],
    responses: {
        200: {
            description: 'Events fetched',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            events: z.array(eventGetAllResponseSchema)
                        })
                    )
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            events: z.array(eventGetAllResponseSchema).nullable()
                        })
                    )
                }
            }
        }
    }
})
event.openapi(getEventsRoute, getEvents)

event.use('/:id', authMiddleware(['admin', 'professor']))
const getEventRoute = createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Event'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Get event detail',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            event: eventGetByIDResponseSchema
                        })
                    )
                }
            }
        },
        400: {
            description: 'Invalid request',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            event: eventGetByIDResponseSchema.nullable()
                        })
                    )
                }
            }
        },
        404: {
            description: 'Event not found',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            event: eventGetByIDResponseSchema.nullable()
                        })
                    )
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            event: eventGetByIDResponseSchema.nullable()
                        })
                    )
                }
            }
        }
    },
})
event.openapi(getEventRoute, getEvent)

event.use('/', authMiddleware(['admin']))
const createEventRoute = createRoute({
    method: 'post',
    path: '/',
    tags: ['Event'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createEventSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Event created',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventCreateResponseSchema
                    )
                }
            }
        },
        400: {
            description: 'Bad request',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventCreateResponseSchema
                    )
                }
            }
        },

        401: {
            description: 'Unauthorized',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventCreateResponseSchema
                    )
                }
            }
        },

        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventCreateResponseSchema
                    )
                }
            }

        }
    }
})
event.openapi(createEventRoute, createEvent)

event.use('/:id', authMiddleware(['admin']))
const updateEventRoute = createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Event'],
    request: {
        params: z.object({
            id: z.string()
        }),
        body: {
            content: {
                'application/json': {
                    schema: apiResponse(
                        updateEventSchema
                    )
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Event updated',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventUpdateResponseSchema
                    )
                }
            }
        },

        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventUpdateResponseSchema
                    )
                }
            }
        },

        401: {
            description: 'Unauthorized',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventUpdateResponseSchema
                    )
                }
            }
        },

        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(
                        eventUpdateResponseSchema
                    )
                }
            }
        }
    }
})
event.openapi(updateEventRoute, updateEvent)

const deleteEventRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Event'],
    request: {
        params: z.object({
            id: z.string()
        })
    },
    responses: {
        200: {
            description: 'Event deleted',
            content: {
                'application/json': {
                    schema: apiResponse(z.object({
                        status: z.boolean()
                    }))
                }
            }
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: apiResponse(z.object({
                        status: z.boolean()
                    }))
                }
            }
        },
        404: {
            description: 'Event Not Found',
            content: {
                'application/json': {
                    schema: apiResponse(
                        z.object({
                            status: z.boolean()
                        })
                    )
                }
            }
        },
        500: {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: apiResponse(z.object({
                        status: z.boolean()
                    }))
                }
            }
        }
    }
})
event.openapi(deleteEventRoute, deleteEvent)

export default event

// const updateCertificateStatusRoute = createRoute({
//   method: 'put',
//   path: '/{id}/status',
//   tags: ['Event'],
//   request: {
//     params: z.object({
//       id: z.string()
//     }),
//     body: {
//       content: {
//         'application/json': {
//           schema: updateEventCertificateApproveSchema
//         }
//       }
//     }
//   },
//   responses: {
//     200: { description: 'Certificate status updated' }
//   }
// })

// event.openapi(updateCertificateStatusRoute, updateEventCertificateUpdate)
