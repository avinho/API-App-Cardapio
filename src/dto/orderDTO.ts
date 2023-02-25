export interface OrderDTO {
  id?: string
  description: string
  clientId: string
  status: number
  priceTotal?: number | null
  orderItems?: string[]
}
