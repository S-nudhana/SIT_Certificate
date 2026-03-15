import { RowDataPacket } from "mysql2"

export interface EventGetCertificateDownloadQuery extends RowDataPacket {
    certificate_filePath: string
}

export interface EventGetCertificateDownloadResponse {
    certificate_filePath: string
}