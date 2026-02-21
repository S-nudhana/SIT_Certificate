import { Context } from "hono";

import { deleteEventModel } from "../../models/event.model";
import { deleteEventSchema } from "../../validators/event.schema";
import { EventDeletePayload, EventDeleteResponse } from "../../types/event.type";

export default async function deleteEvent(c: Context) {
    try {
        const id = c.req.param('id')
        const result = deleteEventSchema.safeParse(id)
        if (!result.success) {
            return c.json({ message: 'Input Format is Invalid' }, 400)
        }
        const deleteEventPayload: EventDeletePayload = {
            eventID: result.data.eventID
        }
        const deleteEvent: EventDeleteResponse = await deleteEventModel(deleteEventPayload)
        if (!deleteEvent.status) {
            return c.json({ message: "Event Not Found" }, 404)
        }
        return c.json({ message: "Event Deleted Successfully" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ message: "Internal Server Error" }, 500)
    }
}