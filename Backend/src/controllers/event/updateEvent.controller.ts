import { Context } from "hono";

import { EventUpdatePayload, EventUpdateResponse } from "../../types/event.type";
import { updateEventModel } from "../../models/event.model";
import { updateEventSchema } from "../../validators/event.schema";

export default async function updateEvent(c: Context) {
    try {
        const body = await c.req.json()
        const result = updateEventSchema.safeParse(body)
        if (!result.success) {
            return c.json({
                data: null,
                message: 'Input Format is Invalid',
            }, 400)
        }

        const { eventID, title, status, startDate } = result.data
        const eventPayload: EventUpdatePayload = {
            eventID,
            title,
            status,
            startDate: new Date(startDate)
        }
        const updateEvent: EventUpdateResponse = await updateEventModel(eventPayload)
        if (!updateEvent.status) {
            return c.json({ message: "Failed to Update Event" }, 500)
        }
        return c.json({ data: { eventID: updateEvent.eventID }, message: "Event Updated" }, 201)
    } catch (error) {
        console.error(error)
        return c.json({ data: { eventID: null }, message: "Internal Server Error" }, 500)
    }
}