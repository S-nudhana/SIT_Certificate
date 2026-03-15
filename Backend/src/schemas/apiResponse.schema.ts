import { z } from "zod"

export const apiResponse = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
    message: z.string()
  })