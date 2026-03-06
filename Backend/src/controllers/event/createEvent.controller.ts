import { Context } from "hono";

import { createEventModel } from "../../models/event.model";
import { createEventSchema } from "../../validators/event.schema";
import { EventCreatePayload, EventCreateResponse } from "../../types/event.type";
import { TokenData } from "../../types/jwt.type";

export default async function createEvent(c: Context) {
    try {
        const body = await c.req.json()
        const result = createEventSchema.safeParse(body)
        if (!result.success) {
            return c.json({
                data: null,
                message: 'Input Format is Invalid',
            }, 400)
        }

        const { title, status, startDate } = result.data
        const userData: TokenData | null = c.get('userData')
        if (!userData) {
            return c.json({ data: { eventID: null }, message: "Unauthorized" }, 401)
        }

        const eventPayload: EventCreatePayload = {
            title,
            status,
            startDate: new Date(startDate),
            createdBy: userData.uid
        }
        const createEvent: EventCreateResponse = await createEventModel(eventPayload)
        if (!createEvent.status) {
            return c.json({ data: { eventID: null }, message: "Failed to Create Event" }, 500)
        }
        return c.json({ data: { eventID: createEvent.eventID }, message: "Event Created" }, 201)
    } catch (error) {
        console.error(error)
        return c.json({ data: { eventID: null }, message: "Internal Server Error" }, 500)
    }
}