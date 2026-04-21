import AxiosInstance from "../axios/axiosInstances"

import type { GetSampleCertificatePayload } from "../../types/certificate/certificateAPI.type"

export async function getSampleCertificateAPI(payload: GetSampleCertificatePayload) {
    const formData = new FormData()
    formData.append("certTemplate", payload.pdfFile)
    formData.append("textSize", payload.fontSize.toString())
    formData.append("textXPos", payload.left.toString())
    formData.append("textYPos", payload.top.toString())

    const res = await AxiosInstance.post(
        "/certificate/sample",
        formData,
        {
            responseType: "blob",
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to generate sample certificate")
}

export async function generateCertificateAPI(eventID: number) {
    const res = await AxiosInstance.get(`/certificate/generate/${eventID}`)
    if (res.status === 200) {
        return true
    }
    throw new Error("Failed to generate certificate")
}

export async function getDownloadCertificateAPI(eventID: number) {
    const res = await AxiosInstance.get(`/certificate/download/${eventID}`, {
        responseType: "blob",
    })
    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to download certificate")
}

export async function regenerateCertificateAPI(eventID: number) {
    const res = await AxiosInstance.get(`/certificate/regenerate/${eventID}`)
    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to regenerate certificate")
}