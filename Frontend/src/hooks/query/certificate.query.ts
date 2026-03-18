import { useMutation } from "@tanstack/react-query"
import { getSampleCertificateAPI } from "../../services/apis/certificate.api"

export function useSampleCertificate() {
    return useMutation({
        mutationFn: getSampleCertificateAPI,
    })
}