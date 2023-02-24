export interface OrderDTO {
  id?: string
  description: string
  clientId: string
  status: number
  priceTotal?: number
  orderItems?: string[]
}
