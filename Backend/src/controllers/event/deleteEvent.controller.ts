import { Context } from "hono";

import { deleteEventModel } from "../../models/event.model";
import { deleteEventSchema } from "../../validators/event.validators";
import { EventDeleteResponse } from "../../types/event.type";

export default async function deleteEvent(c: Context) {
    try {
        const eventID = c.req.param('id')
        const result = deleteEventSchema.safeParse({ eventID: Number(eventID) })
        if (!result.success) {
            return c.json({ data: { status: false }, message: 'Input Format is Invalid' }, 400)
        }
        const deleteEvent: EventDeleteResponse = await deleteEventModel(result.data.eventID)
        if (!deleteEvent.status) {
            return c.json({ data: { status: false }, message: "Event Not Found" }, 404)
        }
        return c.json({ data: { status: true }, message: "Event Deleted Successfully" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ data: { status: false }, message: "Internal Server Error" }, 500)
    }
}