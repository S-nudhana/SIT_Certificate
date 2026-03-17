import { z } from 'zod'

export const eventGetAllResponseSchema = z.object({
  eventID: z.number(),
  eventTitle: z.string(),
  eventStatus: z.string(),
  eventParticipant: z.number(),
  eventCreateAt: z.date(),
  eventUpdateAt: z.date()
})

export const eventGetByIDResponseSchema = z.object({
  eventID: z.number(),
  eventTitle: z.string(),
  certificateURL: z.string(),
  eventStatus: z.string(),
  eventStartDate: z.date(),
  eventEndDate: z.date()
})

export const eventCreateResponseSchema = z.object({
    eventID: z.number()
})

export const eventUpdateResponseSchema = z.object({
    eventID: z.number()
})
export const eventGetCertificateDownloadResponseSchema = z.object({
    certificateURL: z.string()
})

export const eventGetCertificateTemplateResponseSchema = z.object({
    certificateTemplate: z.string(),
    certificateExcel: z.string(),
    textSize: z.number(),
    textYPosition: z.number()
})