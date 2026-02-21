import { ResultSetHeader } from "mysql2"

import { db } from "../config/db.config"
import {
    EventDetailQuery,
    EventFullDetailQuery,
    EventUpdatePayload,
    EventDeletePayload,
    EventCreatePayload,
    EventDeleteResponse,
    EventUpdateResponse,
    EventCreateResponse,
    EventGetAllResponse,
    EventGetByIDResponse,
    EventGetByIDPayload
} from "../types/event.type"

export async function createEventModel(event: EventCreatePayload): Promise<EventCreateResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO events (event_title, event_status, event_date) VALUES (?, ?, ?)",
            [event.title, event.status, event.startDate]
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
            "UPDATE events SET event_title = ?, event_status = ?, event_date = ? WHERE event_id = ?",
            [event.title, event.status, event.startDate, event.eventID]
        )
        return { status: result.affectedRows > 0, eventID: event.eventID }
    } catch (error) {
        console.error(error)
        return { status: false, eventID: -1 }
    }
}

export async function deleteEventModel(event: EventDeletePayload): Promise<EventDeleteResponse> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM events WHERE event_id = ?",
            [event.eventID]
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
            "SELECT event_id, event_title, event_status, created_at FROM events WHERE event_status = 'active' ORDER BY event_created_at DESC"
        )
        if (!rows || rows.length === 0) {
            return null
        }
        return rows.map((row: EventDetailQuery) => ({
            eventID: row.id,
            eventTitle: row.title,
            eventStatus: row.status,
            eventDate: row.created_at
        }))
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getEventByIdModel(event: EventGetByIDPayload): Promise<EventGetByIDResponse | null> {
    try {
        const [rows] = await db.query<EventFullDetailQuery[]>(
            "SELECT event_id, event_title, event_certificate_url, event_status, event_date FROM events WHERE event_id = ?",
            [event.eventID]
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