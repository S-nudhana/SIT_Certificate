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
} from "../types/event.type"

export async function createEventModel(event: EventCreatePayload): Promise<EventCreateResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO events (event_title, event_status, event_startDate, event_endDate, event_certificate_template, event_certificate_excel, event_email_template, event_text_size, event_text_y_position, event_createBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            "UPDATE events SET event_title = ?, event_status = ?, event_startDate = ?, event_endDate = ?, event_certificate_template = ?, event_certificate_excel = ?, event_email_template = ?, event_text_size = ?, event_text_y_position = ? WHERE event_id = ?",
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
            "SELECT event_id, event_title, event_status, event_startDate, event_endDate FROM events WHERE event_status = 'created' or event_status = 'cert_generated' ORDER BY event_createAt DESC"
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return rows.map((row: EventDetailQuery) => ({
            eventID: row.event_id,
            eventTitle: row.event_title,
            eventStatus: row.event_status,
            eventStartDate: row.event_startDate,
            eventEndDate: row.event_endDate
        }))
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getEventByIdModel(eventId: number): Promise<EventGetByIDResponse | null> {
    try {
        const [rows] = await db.query<EventFullDetailQuery[]>(
            "SELECT event_id, event_title, event_certificate_url, event_status, event_startDate, event_endDate FROM events WHERE event_id = ?",
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
            eventStartDate: rows[0].event_startDate,
            eventEndDate: rows[0].event_endDate
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getEventCertificateTemplateExcelModel(eventID: number): Promise<EventGetCertificateTemplateResponse | null> {
    try {
        const [rows] = await db.query<EventGetCertificateTemplateQuery[]>(
            "SELECT event_certificate_template, event_certificate_excel, event_text_size, event_text_y_pos FROM events WHERE event_id = ?",
            [eventID]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return {
            certificateTemplate: rows[0].event_certificate_template,
            certificateExcel: rows[0].event_certificate_excel,
            textSize: rows[0].event_text_size,
            textYPosition: rows[0].event_text_y_pos
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function updateEventStatusModel(eventID: number, status: string): Promise<EventUpdateStatusResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "UPDATE events SET event_status = ? WHERE event_id = ?",
            [status, eventID]
        )
        return { status: result.affectedRows === 1, eventID: eventID }
    } catch (error) {
        console.error(error)
        return { status: false, eventID: -1 }
    }
}