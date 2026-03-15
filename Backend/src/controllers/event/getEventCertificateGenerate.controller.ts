import { Context } from "hono"
import fs from "fs/promises"
import path from "path"
import XLSX from "xlsx"

import { getCertificateGenerateSchema } from "../../validators/event.validators"
import { getEventCertificateTemplateExcelModel, insertCertificateRecord } from "../../models/event.model"
import { fetchAndFillCertificate } from "../../utils/certificate"

export default async function getEventCertificateGenerate(c: Context) {
    let tempDir = ""
    try {
        const eventID = c.req.param("id")
        const result = getCertificateGenerateSchema.safeParse(eventID)
        if (!result.success) {
            return c.json({
                data: null,
                message: "Input Format is Invalid"
            }, 400)
        }

        const template = await getEventCertificateTemplateExcelModel(result.data.eventID)
        if (!template) {
            return c.json({
                data: null,
                message: "Certificate or Excel template not found for the event"
            }, 404)
        }

        const pdfPath = template.certificateTemplate
        const pdfBytes = await fs.readFile(pdfPath)

        const excelPath = template.certificateExcel
        const workbook = XLSX.readFile(excelPath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(worksheet)

        tempDir = path.join(process.cwd(), "temp", `cert-${Date.now()}`)
        await fs.mkdir(tempDir, { recursive: true })

        const generatedCertificates: { email: string, filename: string }[] = []
        for (const row of rows) {
            const { firstname, lastname, email } = row as any
            const certificate: Buffer | null =
                await fetchAndFillCertificate(
                    pdfBytes,
                    firstname,
                    lastname,
                    template.textYPosition,
                    template.textSize
                )
            if (!certificate) {
                throw new Error(`Failed to generate certificate for ${firstname} ${lastname}`)
            }
            const safeEmail = email.replace(/[^a-zA-Z0-9@._-]/g, "")
            const filename = `${eventID}_${safeEmail}.pdf`
            const filepath = path.join(tempDir, filename)
            await fs.writeFile(filepath, certificate)
            generatedCertificates.push({
                email,
                filename
            })
        }
        const finalDir = path.join(process.cwd(), "certificates")
        await fs.mkdir(finalDir, { recursive: true })
        const files = await fs.readdir(tempDir)
        for (const file of files) {
            await fs.rename(
                path.join(tempDir, file),
                path.join(finalDir, file)
            )
        }
        for (const cert of generatedCertificates) {
            const certPath = path.join("certificates", cert.filename)
            await insertCertificateRecord(result.data.eventID, cert.email, certPath)
        }
        return c.json({
            message: "Certificates generated successfully"
        })
    } catch (error) {
        console.error(error)
        return c.json({
            message: "Internal Server Error"
        }, 500)
    } finally {
        if (tempDir) {
            await fs.rm(tempDir, { recursive: true, force: true })
        }
    }
}