import AxiosInstance from "../axios/axiosInstances"

import type { CreateEventPayload, GetSampleCertificatePayload } from "../../types/event/eventAPI.type"

export async function createEventAPI(payload: CreateEventPayload) {
    const formData = new FormData()

    formData.append("title", payload.title)
    formData.append("certTemplate", payload.pdfFile)
    formData.append("certExcel", payload.excelFile)
    formData.append("textSize", payload.fontSize.toString())
    formData.append("textXPos", payload.textX.toString())
    formData.append("textYPos", payload.textY.toString())

    const res = await AxiosInstance.post("/event", formData)
    if (res.status === 201) {
        return res
    }
    throw new Error("Failed to create event")
}

export async function getAllEventsAPI() {
    const res = await AxiosInstance.get("/event")
    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to fetch events")
}

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

    return res
}