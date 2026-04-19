import { Context } from "hono"

import { getCertificateSampleGenerateSchema } from "../../validators/certificate.validators"
import { fetchAndFillCertificate } from "../../utils/certificate"

export default async function getCertificateSampleGenerate(c: Context) {
    try {
        const body = await c.req.parseBody()
        const textXPos = Number(body.textXPos)
        const textYPos = Number(body.textYPos)
        const textSize = Number(body.textSize)
        const result = getCertificateSampleGenerateSchema.safeParse({ textXPos, textYPos, textSize })
        if (!result.success) {
            return c.json({
                message: "Input Format is Invalid"
            }, 400)
        }
        const certTemplate = body.certTemplate as File
        if (!certTemplate) {
            return c.json({
                message: "Files are required"
            }, 400)
        }
        if (certTemplate.type !== "application/pdf") {
            return c.json({
                message: "Certificate template must be a PDF file"
            }, 400)
        }
        const pdfBuffer = Buffer.from(await certTemplate.arrayBuffer())
        const certificate: Buffer | null =
            await fetchAndFillCertificate(
                pdfBuffer,
                "สมชาย",
                "ส่ายหน้า",
                result.data.textYPos,
                result.data.textXPos,
                result.data.textSize
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