/* eslint-disable no-useless-constructor */
import { Order, OrderItem } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { IOrder } from '../interfaces/IOrder'

export class OrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(data: OrderDTO): Promise<Order> {
    return await this.orderRepository.createOrder(data)
  }

  async addItem(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem> {
    return await this.orderRepository.addItem(orderId, productId, quantity)
  }

  async removeItem(orderId: string, itemId: string): Promise<void> {
    return await this.orderRepository.removeItem(orderId, itemId)
  }

  async discount(orderId: string, discount: number): Promise<Order> {
    return await this.orderRepository.discount(orderId, discount)
  }

  async findAll(): Promise<any[]> {
    return await this.orderRepository.findAll()
  }

  async findById(id: string): Promise<IOrder> {
    return await this.orderRepository.findById(id)
  }

  async findByClientId(clientId: string): Promise<Order[]> {
    return await this.orderRepository.findByClientId(clientId)
  }

  async update(id: string, data: OrderDTO): Promise<Order> {
    return await this.orderRepository.update(id, data)
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.deleteOrder(id)
  }
}
