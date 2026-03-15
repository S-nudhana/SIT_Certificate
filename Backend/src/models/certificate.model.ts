import { ResultSetHeader } from "mysql2"

import { db } from "../config/db.config"
import {
    EventGetCertificateDownloadResponse,
    EventGetCertificateDownloadQuery
} from "../types/certificate.type"

export async function insertCertificateRecord(eventID: number, email: string, filename: string): Promise<boolean> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO certificates (certificate_eventId, certificate_recipientEmail, certificate_filePath) VALUES (?, ?, ?)",
            [eventID, email, filename]
        )
        return result.affectedRows === 1
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function getEventCertificateDownloadModel(eventID: number): Promise<EventGetCertificateDownloadResponse[] | null> {
    try {
        const [rows] = await db.query<EventGetCertificateDownloadQuery[]>(
            "SELECT certificate_filePath FROM certificates WHERE certificate_eventId = ?",
            [eventID]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return rows.map((row: EventGetCertificateDownloadQuery) => ({
            certificate_filePath: row.certificate_filePath
        }))
    } catch (error) {
        console.error(error)
        return null
    }
}