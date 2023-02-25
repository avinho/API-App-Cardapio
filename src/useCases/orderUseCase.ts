/* eslint-disable no-useless-constructor */
import { Order, OrderItems } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { IOrder } from '../interfaces/IOrder'

export class OrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async create(data: OrderDTO): Promise<Order> {
    return await this.orderRepository.create(data)
  }

  async addItem(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItems> {
    return await this.orderRepository.addItem(orderId, productId, quantity)
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

  async delete(id: string): Promise<Object> {
    await this.orderRepository.delete(id)

    return { message: 'Order deleted' }
  }
}
