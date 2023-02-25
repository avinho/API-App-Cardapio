import { Order, OrderItems } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrder } from '../interfaces/IOrder'

export interface IOrderRepository {
  create(data: OrderDTO): Promise<Order>
  addItem(
    order: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItems>
  findById(id: string): Promise<IOrder>
  findAll(): Promise<IOrder[]>
  findByClientId(clientId: string): Promise<Order[]>
  update(id: string, data: OrderDTO): Promise<Order>
  delete(id: string): Promise<void>
}
