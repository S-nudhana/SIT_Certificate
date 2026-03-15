import { Context } from "hono"
import path from "path"
import archiver from "archiver"

import { getCertificateDownloadSchema } from "../../validators/certificate.validators"
import { getEventCertificateDownloadModel } from "../../models/certificate.model"
import { EventGetCertificateDownloadResponse } from "../../types/certificate.type"

export default async function getEventCertificateDownload(c: Context) {
    try {
        const eventID = c.req.param("id")
        const result = getCertificateDownloadSchema.safeParse({ eventID })
        if (!result.success) {
            return c.json({
                data: null,
                message: "Input Format is Invalid"
            }, 400)
        }

        const filePathList: EventGetCertificateDownloadResponse[] | null = await getEventCertificateDownloadModel(result.data.eventID)
        if (!filePathList || filePathList.length === 0) {
            return c.json({
                data: null,
                message: "No certificates found"
            }, 404)
        }

        const archive = archiver("zip", {
            zlib: { level: 6 }
        })
        const stream = new ReadableStream({
            start(controller) {
                archive.on("data", (chunk: Buffer) => controller.enqueue(chunk))
                archive.on("end", () => controller.close())
                archive.on("error", (err: Error) => controller.error(err))
                for (const file of filePathList) {
                    const filePath = path.join(process.cwd(), file.certificate_filePath)
                    archive.file(filePath, {
                        name: path.basename(filePath)
                    })
                }
                archive.finalize()
            }
        })
        c.header("Content-Type", "application/zip")
        c.header(
            "Content-Disposition",
            `attachment; filename="event-${eventID}-certificates.zip"`
        )
        return c.body(stream)
    } catch (error) {
        console.error(error)
        return c.json({
            data: null,
            message: "Internal Server Error"
        }, 500)
    }
}