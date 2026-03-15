import { Context } from "hono";

import { TokenData } from "../../types/jwt.type";
import { updateEventStatusSchema } from "../../validators/event.validators";

import { updateEventStatusModel } from "../../models/event.model";

export default async function updateEventStatus(c: Context) {
    try {
        const eventID = c.req.param('id')
        const status = c.req.query('status')
        const result = updateEventStatusSchema.safeParse({ eventID, status })
        if (!result.success) {
            return c.json({
                data: null,
                message: 'Input Format is Invalid',
            }, 400)
        }

        const userData: TokenData | null = c.get("userData")
        if (!userData) {
            return c.json({
                data: null,
                message: "Unauthorized"
            }, 401)
        }

        const updateResult = await updateEventStatusModel(result.data.eventID, result.data.status)
        if (!updateResult.status) {
            return c.json({
                data: null,
                message: "Fail to Update Event Status"
            }, 404)
        }
        return c.json({
            data: { eventID: updateResult.eventID},
            message: "Event Status Updated Successfully"
        }, 200)
    } catch (error) {
        console.error(error)
        return c.json({
            data: null,
            message: "Internal Server Error"
        }, 500)
    }
}