import { Context } from "hono";

import { createEventModel } from "../../models/event.model";
import { createEventSchema } from "../../validators/event.validators";
import { EventCreatePayload, EventCreateResponse } from "../../types/event.type";
import { TokenData } from "../../types/jwt.type";
import { countExcelRows } from "../../utils/countExcelRows";
import { saveFile } from "../../utils/uploadFile"

export default async function createEvent(c: Context) {
    try {
        const body = await c.req.parseBody()
        const title = body.title as string
        const textSize = Number(body.textSize)
        const textXPos = Number(body.textXPos)
        const textYPos = Number(body.textYPos)

        const certTemplate = body.certTemplate as File
        const certExcel = body.certExcel as File

        const result = createEventSchema.safeParse({
            title,
            textSize,
            textXPos,
            textYPos
        })
        if (!result.success) {
            return c.json({
                data: { eventID: -1 },
                message: "Input Format is Invalid"
            }, 400)
        }
        if (!certTemplate || !certExcel) {
            return c.json({
                data: { eventID: -1 },
                message: "Files are required"
            }, 400)
        }
        if (certTemplate.type !== "application/pdf") {
            return c.json({
                data: { eventID: -1 },
                message: "Certificate template must be a PDF file"
            }, 400)
        }
        if (certExcel.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return c.json({
                data: { eventID: -1 },
                message: "Excel file must be .xlsx"
            }, 400)
        }

        const userData: TokenData | null = c.get("userData")
        if (!userData) {
            return c.json({
                data: { eventID: -1 },
                message: "Unauthorized"
            }, 401)
        }

        const certTemplatePath = await saveFile(certTemplate, "templates", result.data.title.replace(/\s+/g, '_') + "_template")
        const certExcelPath = await saveFile(certExcel, "excels", result.data.title.replace(/\s+/g, '_') + "_excel")

        let eventParticipant = 0

        if (certExcelPath !== null) {
            eventParticipant = countExcelRows(certExcelPath)
        }
        if (result.data.textSize === undefined) {
            result.data.textSize = 24
        }
        if (result.data.textXPos === undefined) {
            result.data.textXPos = 50
        }
        if (result.data.textYPos === undefined) {
            result.data.textYPos = 50
        }
        const eventPayload: EventCreatePayload = {
            title: result.data.title,
            status: "created",
            certTemplate: certTemplatePath,
            certExcel: certExcelPath,
            textSize: result.data.textSize,
            textXPos: result.data.textXPos,
            textYPos: result.data.textYPos,
            participant: eventParticipant,
            createdBy: userData.uid
        }

        const createEvent: EventCreateResponse = await createEventModel(eventPayload)
        if (!createEvent.status) {
            return c.json({
                data: { eventID: -1 },
                message: "Failed to Create Event"
            }, 500)
        }
        return c.json({
            data: { eventID: createEvent.eventID },
            message: "Event Created"
        }, 201)

    } catch (error) {
        console.error(error)
        return c.json({
            data: { eventID: -1 },
            message: "Internal Server Error"
        }, 500)
    }
}