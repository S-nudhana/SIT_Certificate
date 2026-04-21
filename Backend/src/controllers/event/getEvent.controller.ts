import { Context } from "hono";

import { getEventByIdModel } from "../../models/event.model";
import { getEventByIdSchema } from "../../validators/event.validators";
import { EventGetByIDResponse } from "../../types/event.type";

export default async function getEvent(c: Context) {
    try {
        const eventID = c.req.param('id')
        const result = getEventByIdSchema.safeParse({ eventID: Number(eventID) })
        if (!result.success) {
            return c.json({
                data: { event: null },
                message: 'Input Format is Invalid',
            }, 400)
        }
        const event: EventGetByIDResponse | null = await getEventByIdModel(result.data.eventID)
        if (!event) {
            return c.json({ data: { event: null }, message: "Event Not Found" }, 404)
        }
        return c.json({ data: { event: event }, message: "Event Found" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ data: { event: null }, message: "Internal Server Error" }, 500)
    }
}