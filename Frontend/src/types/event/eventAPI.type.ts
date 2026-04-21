export interface CreateEventPayload {
    title: string
    pdfFile: File
    excelFile: File
    fontSize: number
    textX: number
    textY: number
}

export interface UpdateEventPayload {
    eventID: number
    title: string
    pdfFile: File
    excelFile: File
    fontSize: number
    textX: number
    textY: number
}