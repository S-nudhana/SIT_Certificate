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

    return res
}