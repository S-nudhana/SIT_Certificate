import { Context } from "hono"
import fs from "fs/promises"
import path from "path"

import { getAllEventsModel } from "../../models/event.model"
import { EventGetAllResponse } from "../../types/event.type"

export default async function getEvents(c: Context) {
    try {
        const events: EventGetAllResponse[] | null = await getAllEventsModel()

        if (!events || events.length === 0) {
            return c.json({ data: { events: [] }, message: "No Event Found" }, 200)
        }

        const eventsWithFiles = await Promise.all(
            events.map(async (event) => {
                try {
                    const coverPath = path.join(process.cwd(), event.eventCertificateCover)
                    const pngBytes = await fs.readFile(coverPath)
                    return {
                        ...event,
                        eventCertificateCover: pngBytes.toString("base64"),
                    }
                } catch {
                    return {
                        ...event,
                        eventCertificateCover: null
                    }
                }
            })
        )

        return c.json(
            { data: { events: eventsWithFiles }, message: "Events Found" },
            200
        )
    } catch (error) {
        console.error(error)

        return c.json(
            { data: { events: null }, message: "Internal Server Error" },
            500
        )
    }
}