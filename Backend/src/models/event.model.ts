import { ResultSetHeader } from "mysql2"

import { db } from "../config/db.config"
import {
    EventDetailQuery,
    EventFullDetailQuery,
    EventUpdatePayload,
    EventCreatePayload,
    EventDeleteResponse,
    EventUpdateResponse,
    EventCreateResponse,
    EventGetAllResponse,
    EventGetByIDResponse,
    EventUpdateStatusResponse,
    EventGetCertificateTemplateQuery,
    EventGetCertificateTemplateResponse,
    EventGetCertificateDownloadResponse,
    EventGetCertificateDownloadQuery
} from "../types/event.type"

export async function createEventModel(event: EventCreatePayload): Promise<EventCreateResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO events (event_title, event_status, event_date, event_end_date, event_certificate_template, event_certificate_excel, event_email_template, event_text_size, event_text_y_position, event_created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [event.title, event.status, event.startDate, event.endDate, event.certTemplate, event.certExcel, event.emailTemplate, event.textSize, event.textYPos, event.createdBy]
        )
        return { status: result.affectedRows > 0, eventID: result.insertId }
    } catch (error) {
        console.error(error)
        return { status: false, eventID: -1 }
    }
}

export async function updateEventModel(event: EventUpdatePayload): Promise<EventUpdateResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "UPDATE events SET event_title = ?, event_status = ?, event_date = ?, event_end_date = ?, event_certificate_template = ?, event_certificate_excel = ?, event_email_template = ?, event_text_size = ?, event_text_y_position = ? WHERE event_id = ?",
            [event.title, event.status, event.startDate, event.endDate, event.certTemplate, event.certExcel, event.emailTemplate, event.textSize, event.textYPos, event.eventID]
        )
        return { status: result.affectedRows > 0, eventID: event.eventID }
    } catch (error) {
        console.error(error)
        return { status: false, eventID: -1 }
    }
}

export async function deleteEventModel(eventId: number): Promise<EventDeleteResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM events WHERE event_id = ?",
            [eventId]
        )
        return { status: result.affectedRows > 0 }
    } catch (error) {
        console.error(error)
        return { status: false }
    }
}

export async function getAllEventsModel(): Promise<EventGetAllResponse[] | null> {
    try {
        const [rows] = await db.query<EventDetailQuery[]>(
            "SELECT event_id, event_title, event_status, event_date FROM events WHERE event_status = 'active' ORDER BY event_created_at DESC"
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return rows.map((row: EventDetailQuery) => ({
            eventID: row.id,
            eventTitle: row.title,
            eventStatus: row.status,
            eventDate: row.event_date
        }))
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getEventByIdModel(eventId: number): Promise<EventGetByIDResponse | null> {
    try {
        const [rows] = await db.query<EventFullDetailQuery[]>(
            "SELECT event_id, event_title, event_certificate_url, event_status, event_date FROM events WHERE event_id = ?",
            [eventId]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return {
            eventID: rows[0].event_id,
            eventTitle: rows[0].event_title,
            certificateURL: rows[0].certificate_url,
            eventStatus: rows[0].event_status,
            eventDate: rows[0].event_date
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function updateEventStatus(eventID: number, status: string): Promise<EventUpdateStatusResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "UPDATE events SET event_status = ? WHERE event_id = ?",
            [status, eventID]
        )
        return { status: result.affectedRows === 1 }
    } catch (error) {
        console.error(error)
        return { status: false }
    }
}

export async function getEventCertificateTemplateExcelModel(eventID: number): Promise<EventGetCertificateTemplateResponse | null> {
    try {
        const [rows] = await db.query<EventGetCertificateTemplateQuery[]>(
            "SELECT event_certificate_template, event_certificate_excel, event_text_size, event_text_y_position FROM events WHERE event_id = ?",
            [eventID]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return {
            certificateTemplate: rows[0].event_certificate_template,
            certificateExcel: rows[0].event_certificate_excel,
            textSize: rows[0].event_text_size,
            textYPosition: rows[0].event_text_y_position
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

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