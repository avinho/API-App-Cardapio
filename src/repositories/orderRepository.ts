import { prisma } from '../database'
import { Order, OrderItem } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrder } from '../interfaces/IOrder'

import { IOrderRepository } from '../interfaces/IOrderRepository'

class OrderRepository implements IOrderRepository {
  async createOrder(data: OrderDTO): Promise<Order> {
    return prisma.order.create({
      data,
    })
  }

  async addItem(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem> {
    const order = await this.findById(orderId)

    const product = await prisma.products.findUniqueOrThrow({
      where: {
        id: productId,
      },
    })

    const orderItems = await prisma.$transaction(async (prisma) => {
      const item = await prisma.orderItem.create({
        data: {
          quantity,
          productId,
          orderId: order.id,
          pricePerUnit: product.price,
          priceTotal: product.price * quantity,
        },
      })

      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: order.id,
        },
      })

      const priceTotal = orderItems.reduce(
        (total, item) => total + item.priceTotal,
        0,
      )

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          priceTotal,
        },
      })

      return item
    })

    return orderItems
  }

  async removeItem(orderId: string, itemId: string): Promise<void> {
    const order = await this.findById(orderId)

    await prisma.orderItem.findUniqueOrThrow({
      where: {
        id: itemId,
      },
    })

    await prisma.$transaction(async (prisma) => {
      const deletedOrderItem = await prisma.orderItem.delete({
        where: {
          id: itemId,
        },
      })

      return deletedOrderItem
    })

    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: order.id,
      },
    })

    const priceTotal = orderItems.reduce(
      (total, item) => total + item.priceTotal,
      0,
    )

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        priceTotal,
      },
    })
  }

  async discount(id: string, discount: number): Promise<Order> {
    const order = await prisma.order.findFirstOrThrow({
      where: { id },
    })

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        priceTotal: {
          decrement: discount,
        },
      },
    })

    return updatedOrder
  }

  async findAll(): Promise<Order[]> {
    const orders = await prisma.order.findMany()

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await prisma.orderItem.findMany({
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

    const orderItems = await prisma.orderItem.findMany({
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
        const orderItems = await prisma.orderItem.findMany({
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
    await prisma.order.findFirstOrThrow({
      where: { id },
    })

    return prisma.order.update({
      where: { id },
      data,
    })
  }

  async deleteOrder(id: string): Promise<void> {
    await prisma.order.findFirstOrThrow({
      where: { id },
    })

    await prisma.order.delete({
      where: { id },
    })
  }
}

export { OrderRepository }
