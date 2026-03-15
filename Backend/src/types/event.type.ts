import { RowDataPacket } from 'mysql2'

export interface EventDetailQuery extends RowDataPacket {
    event_id: number
    event_title: string
    event_status: string
    event_startDate: Date
    event_endDate: Date
}

export interface EventFullDetailQuery extends RowDataPacket {
    event_id: number
    event_title: string
    certificate_url: string
    event_status: string
    event_startDate: Date
    event_endDate: Date
}

export interface EventGetCertificateTemplateQuery extends RowDataPacket {
    event_certificate_template: string
}

export interface EventGetCertificateTemplateResponse {
    certificateTemplate: string
    certificateExcel: string
    textSize: number
    textYPosition: number
}

export interface EventGetAllResponse {
    eventID: number
    eventTitle: string
    eventStatus: string
    eventStartDate: Date
    eventEndDate: Date
}

export interface EventGetByIDResponse {
    eventID: number
    eventTitle: string
    certificateURL: string
    eventStatus: string
    eventStartDate: Date
    eventEndDate: Date
}

export interface EventGetByIDPayload {
    eventID: number
}

export interface EventCreatePayload {
    title: string
    status: string
    startDate: Date
    endDate: Date
    certTemplate: string
    certExcel: string
    emailTemplate: string
    textSize: number
    textYPos: number
    createdBy: string
}

export interface EventCreateResponse {
    status: boolean
    eventID: number
}

export interface EventUpdatePayload {
    eventID: number
    title: string
    status: string
    startDate: Date
    endDate: Date
    certTemplate: string
    certExcel: string
    emailTemplate: string
    textSize: number
    textYPos: number
    createdBy: string
}

export interface EventUpdateResponse {
    status: boolean
    eventID: number
}

export interface EventUpdateStatusResponse {
    status: boolean
}

export interface EventDeletePayload {
    eventID: number
}

export interface EventDeleteResponse {
    status: boolean
}

export interface EventUpdateStatusResponse {
    status: boolean
    eventID: number
}