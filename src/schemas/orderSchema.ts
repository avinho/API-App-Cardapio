import { z } from 'zod'

export const createOrderSchema = z.object({
  description: z.string(),
  status: z.number(),
  orderItems: z.array(z.string()).optional(),
})
