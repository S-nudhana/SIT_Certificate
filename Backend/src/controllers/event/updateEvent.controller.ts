import { Context } from "hono";
import path from "path"

import { EventUpdatePayload, EventUpdateResponse } from "../../types/event.type";
import { TokenData } from "../../types/jwt.type";
import { updateEventModel, getEventCertificateTemplateExcelModel } from "../../models/event.model";
import { updateEventSchema } from "../../validators/event.validators";
import { countExcelRows } from "../../utils/countExcelRows";
import { saveFile } from "../../utils/uploadFile"
import { deleteFile } from "../../utils/deleteFile";
import { convertPdfToPng } from "../../utils/pdfToPng";

export default async function updateEvent(c: Context) {
    try {
        const body = await c.req.parseBody()

        const title = body.title as string
        const textSize = Number(body.textSize)
        const textXPos = Number(body.textXPos)
        const textYPos = Number(body.textYPos)

        const certTemplate = body.certTemplate as File
        const certExcel = body.certExcel as File
        const eventID = Number(c.req.param("id"))
        const result = updateEventSchema.safeParse({
            eventID,
            title,
            textSize,
            textXPos,
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
        if (certTemplate.type !== "application/pdf") {
            return c.json({
                message: "Certificate template must be a PDF file"
            }, 400)
        }
        if (certExcel.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return c.json({
                message: "Excel file must be .xlsx"
            }, 400)
        }
        const eventTemplate = await getEventCertificateTemplateExcelModel(result.data.eventID)
        if (eventTemplate !== null && eventTemplate.certificateTemplate !== null) {
            await deleteFile(eventTemplate.certificateTemplate)
        }
        if (eventTemplate !== null && eventTemplate.certificateExcel !== null) {
            await deleteFile(eventTemplate.certificateExcel)
        }
        if (eventTemplate !== null && eventTemplate.certificatePng !== null) {
            await deleteFile(eventTemplate.certificatePng)
        }
        const certTemplatePath = await saveFile(certTemplate, "templates", result.data.title.replace(/\s+/g, '_') + "_template")
        const certExcelPath = await saveFile(certExcel, "excels", result.data.title.replace(/\s+/g, '_') + "_excel")

        let certPngPath: string = ""

        if (certTemplatePath != null) {
            const pdfPath = path.join(process.cwd(), certTemplatePath)
            const certPng = await convertPdfToPng(pdfPath)
            certPngPath = await saveFile(
                certPng,
                "certificatePng",
                result.data.title.replace(/\s+/g, '_') + "_template_" + Date.now()
            )
        }

        let participantCount = 0
        if (certExcelPath !== null) {
            participantCount = countExcelRows(certExcelPath)
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

        const eventPayload: EventUpdatePayload = {
            eventID: result.data.eventID,
            title: result.data.title,
            status: "created",
            certTemplate: certTemplatePath,
            certExcel: certExcelPath,
            certPng: certPngPath,
            textSize: result.data.textSize,
            textXPos: result.data.textXPos,
            textYPos: result.data.textYPos,
            createdBy: userData.uid,
            participant: participantCount
        }
        const updateEvent: EventUpdateResponse = await updateEventModel(eventPayload)
        if (!updateEvent.status) {
            return c.json({ message: "Failed to Update Event" }, 500)
        }
        return c.json({ message: "Event Updated" }, 201)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error" }, 500)
    }
}