import { useMutation } from "@tanstack/react-query"
import { getSampleCertificateAPI, generateCertificateAPI, getDownloadCertificateAPI } from "../../services/apis/certificate.api"

export function useSampleCertificate() {
    return useMutation({
        mutationFn: getSampleCertificateAPI,
    })
}

export function useGenerateCertificate(eventID: number) {
    return useMutation({
        mutationFn: () => generateCertificateAPI(eventID),
    })
}   

export function useDownloadCertificate(eventID: number) {
    return useMutation({
        mutationFn: () => getDownloadCertificateAPI(eventID),
    })
}