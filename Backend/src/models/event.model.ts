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
            "INSERT INTO events (event_title, event_status, event_certificate_template, event_certificate_excel, event_certificate_png, event_text_size, event_text_x_pos, event_text_y_pos, event_createBy, event_participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [event.title, event.status, event.certTemplate, event.certExcel, event.certPng, event.textSize, event.textXPos, event.textYPos, event.createdBy, event.participant]
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
            "UPDATE events SET event_title = ?, event_status = ?, event_certificate_template = ?, event_certificate_excel = ?, event_certificate_png = ?, event_text_size = ?, event_text_x_pos = ?, event_text_y_pos = ?, event_createBy = ?, event_participants = ? WHERE event_id = ?",
            [event.title, event.status, event.certTemplate, event.certExcel, event.certPng, event.textSize, event.textXPos, event.textYPos, event.createdBy, event.participant, event.eventID]
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
            "SELECT event_id, event_certificate_png, event_title, event_status, event_participants, event_createAt, event_updateAt FROM events WHERE event_status = 'created' or event_status = 'cert_generated' ORDER BY event_createAt DESC"
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return rows.map((row: EventDetailQuery) => ({
            eventID: row.event_id,
            eventTitle: row.event_title,
            eventCertificateCover: row.event_certificate_png,
            eventStatus: row.event_status,
            eventParticipant: row.event_participants,
            eventCreateAt: row.event_createAt,
            eventUpdateAt: row.event_updateAt
        }))
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getEventByIdModel(eventId: number): Promise<EventGetByIDResponse | null> {
    try {
        const [rows] = await db.query<EventFullDetailQuery[]>(
            "SELECT event_id, event_title, event_participants, event_certificate_template, event_certificate_excel, event_status, event_createAt, event_updateAt, event_text_size, event_text_x_pos, event_text_y_pos FROM events WHERE event_id = ?",
            [eventId]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return {
            eventID: rows[0].event_id,
            eventTitle: rows[0].event_title,
            certificateURL: rows[0].event_certificate_template,
            excelURL: rows[0].event_certificate_excel,
            eventStatus: rows[0].event_status,
            eventParticipant: rows[0].event_participants,
            eventTextSize: rows[0].event_text_size,
            eventTextXPos: rows[0].event_text_x_pos,
            eventTextYPos: rows[0].event_text_y_pos,
            eventCreateAt: rows[0].event_createAt,
            eventUpdateAt: rows[0].event_updateAt
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
export async function getEventCertificateTemplateExcelModel(eventID: number): Promise<EventGetCertificateTemplateResponse | null> {
    try {
        const [rows] = await db.query<EventGetCertificateTemplateQuery[]>(
            "SELECT event_certificate_template, event_certificate_excel, event_certificate_png, event_text_size, event_text_x_pos, event_text_y_pos FROM events WHERE event_id = ?",
            [eventID]
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return {
            certificateTemplate: rows[0].event_certificate_template || null,
            certificateExcel: rows[0].event_certificate_excel || null,
            certificatePng: rows[0].event_certificate_png || null,
            textSize: rows[0].event_text_size,
            textXPosition: rows[0].event_text_x_pos,
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