import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAllEventsAPI, createEventAPI, getEventByIdAPI } from "../../services/apis/event.api"

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

export function useGetEventById(eventID: number) {
    return useQuery({
        queryKey: ["events", eventID],
        queryFn: () => getEventByIdAPI(eventID),
    })
}

export function useUpdateEvent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createEventAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] })
        }
    })
}