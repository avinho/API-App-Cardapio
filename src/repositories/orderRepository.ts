import { Order, OrderItems, PrismaClient } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrder } from '../interfaces/IOrder'

import { IOrderRepository } from '../interfaces/IOrderRepository'

const prisma = new PrismaClient()

class OrderRepository implements IOrderRepository {
  async create(data: OrderDTO): Promise<Order> {
    return prisma.order.create({
      data,
    })
  }

  async addItem(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItems> {
    const order = await this.findById(orderId)

    const product = await prisma.products.findUniqueOrThrow({
      where: {
        id: productId,
      },
    })

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        priceTotal: {
          increment: product.price * quantity,
        },
      },
    })

    const orderItem = await prisma.orderItems.create({
      data: {
        quantity,
        productId,
        orderId: order.id,
        pricePerUnit: product.price,
        priceTotal: product.price * quantity,
        createdAt: new Date(),
      },
    })

    return orderItem
  }

  async findAll(): Promise<Order[]> {
    const orders = await prisma.order.findMany()

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await prisma.orderItems.findMany({
          where: {
            orderId: order.id,
          },
        })

        return {
          ...order,
          orderItems,
        }
      }),
    )

    return ordersWithItems
  }

  async findById(id: string): Promise<IOrder> {
    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id,
      },
    })

    const orderItems = await prisma.orderItems.findMany({
      where: {
        orderId: id,
      },
    })

    return {
      ...order,
      orderItems,
    }
  }

  async findByClientId(clientId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { clientId },
    })

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await prisma.orderItems.findMany({
          where: {
            orderId: order.id,
          },
        })

        return {
          ...order,
          orderItems,
        }
      }),
    )

    return ordersWithItems
  }

  async update(id: string, data: OrderDTO): Promise<Order> {
    await this.findById(id)

    return prisma.order.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)

    await prisma.order.delete({
      where: { id },
    })
  }
}

export { OrderRepository }
