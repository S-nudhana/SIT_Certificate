export interface CreateEventPayload {
    title: string
    pdfFile: File
    excelFile: File
    fontSize: number
    textX: number
    textY: number
}

export interface GetSampleCertificatePayload {
    pdfFile: File
    fontSize: number
    left: number
    top: number
}