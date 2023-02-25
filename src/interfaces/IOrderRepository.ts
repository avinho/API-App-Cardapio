import { Order, OrderItem } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrder } from '../interfaces/IOrder'

export interface IOrderRepository {
  createOrder(data: OrderDTO): Promise<Order>
  addItem(
    order: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem>
  removeItem(order: string, itemId: string): Promise<void>
  discount(order: string, discount: number): Promise<Order>
  findById(id: string): Promise<IOrder>
  findAll(): Promise<IOrder[]>
  findByClientId(clientId: string): Promise<Order[]>
  update(id: string, data: OrderDTO): Promise<Order>
  deleteOrder(id: string): Promise<void>
}
