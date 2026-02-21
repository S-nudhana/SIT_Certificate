import { Context } from "hono";

import { getAllEventsModel } from "../../models/event.model";
import { EventGetAllResponse } from "../../types/event.type";

export default async function getEvents(c: Context) {
    try {
        const events: EventGetAllResponse[] | null = await getAllEventsModel();
        if (!events || events.length === 0) {
            return c.json({ data: { events: [] }, message: "No Event Found" }, 200)
        }
        return c.json({ data: { events: events }, message: "Events Found" }, 200)
    } catch (error) {
        console.error(error)
        return c.json({ data: { events: [] }, message: "Internal Server Error" }, 500)
    }
}