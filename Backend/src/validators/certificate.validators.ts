import { Context } from "hono"

import { z } from "zod"

export const getCertificateDownloadSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        })
})

export const getCertificateGenerateSchema = z.object({
    eventID: z
        .number()
        .refine((id) => !isNaN(id), {
            message: 'Invalid Event ID'
        })
})

export const getCertificateSampleGenerateSchema = z.object({
    textXPos: z.number().refine((num) => !isNaN(num), {
        message: 'Invalid textXPos'
    }),
    textYPos: z.number().refine((num) => !isNaN(num), {
        message: 'Invalid textYPos'
    }),
    textSize: z.number().refine((num) => !isNaN(num), {
        message: 'Invalid textSize'
    })
})