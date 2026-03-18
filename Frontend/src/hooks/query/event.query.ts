import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllEventsAPI, createEventAPI } from "../../services/apis/event.api"

export function useGetAllEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: getAllEventsAPI,
    })
}

export function useCreateEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createEventAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] })
        }
    })
}
