import { z } from '@hono/zod-openapi'

export const createEventSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title too long'),
    startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
        }),
    endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
        }),
    emailTemplate: z
        .string()
        .min(1, 'Email Template is required'),
    textSize: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Size'
        }),
    textYPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Y Position'
        })
})

export const updateEventSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        }),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title too long'),
    startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
        }),
    endDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
        }),
    emailTemplate: z
        .string()
        .min(1, 'Email Template is required'),
    textSize: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Size'
        }),
    textYPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Y Position'
        })
})

export const deleteEventSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        })
})

export const getEventByIdSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        })
})

export const updateEventStatusSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        }),
    status: z
        .string()
        .refine((status) => status === 'created' || status === 'pending' || status === 'completed', {
            message: 'Invalid Status'
        })
})