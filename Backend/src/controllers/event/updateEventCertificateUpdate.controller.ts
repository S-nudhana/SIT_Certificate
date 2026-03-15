import { Context } from "hono";

import { updateEventCertificateApproveSchema } from "../../validators/event.validators";

export default async function updateEventCertificateUpdate(c: Context) {
    try {
        const eventID = c.req.param('id')
        const status = c.req.query('status')
        const result = updateEventCertificateApproveSchema.safeParse({ eventID, status })
        if (!result.success) {
            return c.json({
                data: null,
                message: 'Input Format is Invalid',
            }, 400)
        }

    } catch (error) {
        console.error(error)
        return c.json({
            data: null,
            message: "Internal Server Error"
        }, 500)
    }
}