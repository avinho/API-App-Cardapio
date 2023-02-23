import { Order } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'

export interface IOrderRepository {
  create(data: OrderDTO): Promise<Order>
  findById(id: string): Promise<Order | null>
  findAll(): Promise<Order[]>
  findByClientId(clientId: string): Promise<Order[]>
  update(id: string, data: OrderDTO): Promise<Order>
  delete(id: string): Promise<void>
}
