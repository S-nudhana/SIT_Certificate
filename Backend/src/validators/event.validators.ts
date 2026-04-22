import { z } from '@hono/zod-openapi'

export const createEventSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title too long'),
    textSize: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Size'
        })
        .optional(),
    textXPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text X Position'
        })
        .optional(),
    textYPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Y Position'
        })
        .optional()
})

export const updateEventSchema = z.object({
    eventID: z.number(),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title too long'),
    
    textSize: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Size'
        })
        .optional(),
    textXPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text X Position'
        })
        .optional(),
    textYPos: z
        .number()
        .refine((value) => !isNaN(value), {
            message: 'Invalid Text Y Position'
        })
        .optional()
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