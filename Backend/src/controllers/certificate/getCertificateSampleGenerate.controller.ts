import { Context } from "hono"
import fs from "fs/promises"
import path from "path"

import { getCertificateGenerateSchema } from "../../validators/certificate.validators"
import { getEventCertificateTemplateExcelModel } from "../../models/event.model"
import { insertCertificateRecord } from "../../models/certificate.model"
import { fetchAndFillCertificate } from "../../utils/certificate"

export default async function getEventCertificateSampleGenerate(c: Context) {
    try {
        const eventID = c.req.param("id")
        const result = getCertificateGenerateSchema.safeParse({ eventID })
        if (!result.success) {
            return c.json({
                message: "Input Format is Invalid"
            }, 400)
        }

        const template = await getEventCertificateTemplateExcelModel(result.data.eventID)
        if (!template) {
            return c.json({
                message: "Certificate or Excel template not found for the event"
            }, 404)
        }

        const pdfPath = template.certificateTemplate
        if (!pdfPath) {
            return c.json({
                message: "Certificate template not found for the event"
            }, 404)
        }
        const pdfBytes = await fs.readFile(pdfPath)
        const certificate: Buffer | null =
            await fetchAndFillCertificate(
                pdfBytes,
                "John",
                "Doe",
                template.textYPosition,
                template.textXPosition,
                template.textSize
            )

        if (!certificate) {
            return c.json({
                message: "Failed to generate certificate"
            }, 500)
        }

        return new Response(new Uint8Array(certificate), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="certificate_sample.pdf"',
            },
        })
    } catch (error) {
        console.error(error)
        return c.json({
            message: "Internal Server Error"
        }, 500)
    }
}