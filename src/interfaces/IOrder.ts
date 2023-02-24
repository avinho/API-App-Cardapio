import { OrderItems } from '@prisma/client'

export interface IOrder {
  id: string
  description: string
  clientId: string
  status: number
  priceTotal?: number
  createdAt: Date
  updatedAt: Date
  finishedAt: Date | null
  orderItems?: OrderItems[]
}
