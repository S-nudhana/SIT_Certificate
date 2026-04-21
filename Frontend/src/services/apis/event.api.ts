import AxiosInstance from "../axios/axiosInstances"

import type { CreateEventPayload, UpdateEventPayload } from "../../types/event/eventAPI.type"

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

export async function getEventByIdAPI(eventID: number) {
    const res = await AxiosInstance.get(`/event/${eventID}`)
    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to fetch event detail")
}

export async function updateEventByIdAPI(payload: UpdateEventPayload) {
    const formData = new FormData()

    formData.append("title", payload.title)
    formData.append("certTemplate", payload.pdfFile)
    formData.append("certExcel", payload.excelFile)
    formData.append("textSize", payload.fontSize.toString())
    formData.append("textXPos", payload.textX.toString())
    formData.append("textYPos", payload.textY.toString())

    const res = await AxiosInstance.put(`/event/${payload.eventID}`, formData)
    if (res.status === 200) {
        return res
    }
    throw new Error("Failed to update event")
}