import { Context } from "hono";

import { EventUpdatePayload, EventUpdateResponse } from "../../types/event.type";
import { TokenData } from "../../types/jwt.type";
import { updateEventModel } from "../../models/event.model";
import { updateEventSchema } from "../../validators/event.validators";
import { saveFile } from "../../utils/upload"

export default async function updateEvent(c: Context) {
    try {
        const body = await c.req.parseBody()

        const title = body.title as string
        const startDate = body.startDate as string
        const endDate = body.endDate as string
        const emailTemplate = body.emailTemplate as string
        const textSize = body.textSize as string
        const textYPos = body.textYPos as string

        const certTemplate = body.certTemplate as File
        const certExcel = body.certExcel as File

        const result = updateEventSchema.safeParse({
            eventID: c.req.param('id'),
            title,
            startDate,
            endDate,
            emailTemplate,
            textSize,
            textYPos
        })
        if (!result.success) {
            return c.json({
                data: { eventID: -1 },
                message: 'Input Format is Invalid',
            }, 400)
        }

        const userData: TokenData | null = c.get("userData")
        if (!userData) {
            return c.json({
                data: { eventID: -1 },
                message: "Unauthorized"
            }, 401)
        }

        if (!certTemplate || !certExcel) {
            return c.json({
                data: { eventID: -1 },
                message: "Files are required"
            }, 400)
        }

        const certTemplatePath = await saveFile(certTemplate, "templates", result.data.title.replace(/\s+/g, '_') + "_template")
        const certExcelPath = await saveFile(certExcel, "excels", result.data.title.replace(/\s+/g, '_') + "_excel")
        
        const eventPayload: EventUpdatePayload = {
            eventID: result.data.eventID,
            title: result.data.title,
            status: "created",
            startDate: new Date(result.data.startDate),
            endDate: new Date(result.data.endDate),
            certTemplate: certTemplatePath,
            certExcel: certExcelPath,
            emailTemplate: result.data.emailTemplate,
            textSize: result.data.textSize,
            textYPos: result.data.textYPos,
            createdBy: userData.uid
        }
        const updateEvent: EventUpdateResponse = await updateEventModel(eventPayload)
        if (!updateEvent.status) {
            return c.json({ data: { eventID: -1 }, message: "Failed to Update Event" }, 500)
        }
        return c.json({ data: { eventID: updateEvent.eventID }, message: "Event Updated" }, 201)
    } catch (error) {
        console.error(error)
        return c.json({ data: { eventID: -1 }, message: "Internal Server Error" }, 500)
    }
}