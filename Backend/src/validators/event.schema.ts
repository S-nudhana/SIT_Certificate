import { z } from 'zod'

export const createEventSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title too long'),

    status: z.enum(['active', 'ended'], {
        message: 'Invalid Status'
    }),

    startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
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
    status: z.enum(['active', 'ended'], {
        message: 'Invalid Status'
    }),
    startDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid Date Format'
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