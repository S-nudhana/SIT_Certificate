import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllEventsAPI, createEventAPI, getEventByIdAPI } from "../../services/apis/event.api"

export function useGetAllEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: getAllEventsAPI,
    })
}

export function useGetEventById(id?: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventByIdAPI(id as string),
    enabled: !!id,
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
