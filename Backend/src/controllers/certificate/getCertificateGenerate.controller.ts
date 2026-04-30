import { Context } from "hono"
import fs from "fs/promises"
import path from "path"
import XLSX from "xlsx"

import { getCertificateGenerateSchema } from "../../validators/certificate.validators"
import { getEventCertificateTemplateExcelModel, updateEventStatusModel } from "../../models/event.model"
import { insertCertificateRecord, getEventCertificateDownloadModel, deleteEventCertificateModel } from "../../models/certificate.model"
import { fetchAndFillCertificate } from "../../utils/certificate"

export default async function getEventCertificateGenerate(c: Context) {
    let tempDir = ""
    try {
        const eventID = c.req.param("id")
        const result = getCertificateGenerateSchema.safeParse({ eventID: Number(eventID) })
        if (!result.success) {
            return c.json({ message: "Input Format is Invalid" }, 400)
        }

        const existingCertificates = await getEventCertificateDownloadModel(result.data.eventID)
        if (existingCertificates && existingCertificates.length > 0) {
            const deleteStatus = await deleteEventCertificateModel(result.data.eventID)
            if (!deleteStatus) {
                return c.json({ message: "Failed to delete existing certificates for the event" }, 500)
            }
        }

        const template = await getEventCertificateTemplateExcelModel(result.data.eventID)
        if (!template) {
            return c.json({ message: "Certificate or Excel template not found for the event" }, 404)
        }

        const pdfPath = template.certificateTemplate
        if (!pdfPath) {
            return c.json({ message: "Certificate template not found for the event" }, 404)
        }
        const pdfBytes = await fs.readFile(path.join(process.cwd(), pdfPath))

        const excelPath = template.certificateExcel
        if (!excelPath) {
            return c.json({ message: "Excel template not found for the event" }, 404)
        }
        const workbook = XLSX.readFile(path.join(process.cwd(), excelPath))
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(worksheet)

        tempDir = path.join(process.cwd(), "/uploads/temp", `cert-${Date.now()}`)
        await fs.mkdir(tempDir, { recursive: true })

        const generatedCertificates: { email: string, filename: string }[] = []
        for (const row of rows) {
            const { firstname, lastname, email } = row as any
            const certificate: Buffer | null = await fetchAndFillCertificate(
                pdfBytes,
                firstname,
                lastname,
                template.textYPosition,
                template.textXPosition,
                template.textSize
            )
            if (!certificate) {
                throw new Error(`Failed to generate certificate for ${firstname} ${lastname}`)
            }
            const safeEmail = email.replace(/[^a-zA-Z0-9@._-]/g, "")
            const date = new Date().toISOString().split("T")[0]
            const filename = `${eventID}_${safeEmail}_${date}.pdf`
            await fs.writeFile(path.join(tempDir, filename), certificate)
            generatedCertificates.push({ email, filename })
        }

        const finalDir = path.join(process.cwd(), "/uploads/certificateGenerated")
        const files = await fs.readdir(tempDir)
        for (const file of files) {
            await fs.rename(
                path.join(tempDir, file),
                path.join(finalDir, file)
            )
        }

        for (const cert of generatedCertificates) {
            const certPath = path.join("/uploads/certificateGenerated", cert.filename)
            await insertCertificateRecord(result.data.eventID, cert.email, certPath)
        }

        const statusRes = await updateEventStatusModel(result.data.eventID, "cert_generated")
        if (!statusRes || !statusRes.status) {
            return c.json({ message: "Failed to update event status" }, 500)
        }

        return c.json({status: "cert_generated", message: "Certificates generated successfully" })
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error" }, 500)
    } finally {
        if (tempDir) {
            await fs.rm(tempDir, { recursive: true, force: true })
        }
    }
}