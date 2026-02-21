import { RowDataPacket } from 'mysql2'

export interface EventDetailQuery extends RowDataPacket {
    event_id: number
    event_title: string
    event_status: string
    event_date: Date
}

export interface EventFullDetailQuery extends RowDataPacket {
    event_id: number
    event_title: string
    certificate_url: string
    event_status: string
    event_date: Date
}

export interface EventGetAllResponse {
    eventID: number
    eventTitle: string
    eventStatus: string
    eventDate: Date
}

export interface EventGetByIDResponse {
    eventID: number
    eventTitle: string
    certificateURL: string
    eventStatus: string
    eventDate: Date
}

export interface EventGetByIDPayload {
    eventID: number
}

export interface EventCreatePayload {
    title: string
    status: string
    startDate: Date
}

export interface EventCreateResponse {
    status: boolean
    eventID: number
}

export interface EventUpdatePayload {
    eventID: number
    title?: string
    status?: string
    startDate?: Date
}

export interface EventUpdateResponse {
    status: boolean
    eventID: number
}

export interface EventDeletePayload {
    eventID: number
}

export interface EventDeleteResponse {
    status: boolean
}