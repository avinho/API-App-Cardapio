import { prisma } from '../database'
import { Order, OrderItem } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrder } from '../interfaces/IOrder'

import { IOrderRepository } from '../interfaces/IOrderRepository'

class OrderRepository implements IOrderRepository {
  /**
   * Cria uma nova ordem com base nos dados fornecidos.
   *
   * @param {OrderDTO} data - Objeto contendo os dados da nova ordem.
   * @returns {Promise<Order>} - A nova ordem criada.
   */
  async createOrder(data: OrderDTO): Promise<Order> {
    return prisma.order.create({
      data,
    })
  }

  /**
   * Adiciona um novo item a um pedido existente.
   *
   * @param {string} orderId - ID da ordem à qual o item será adicionado.
   * @param {string} productId - ID do produto a ser adicionado à ordem.
   * @param {number} quantity - Quantidade do produto a ser adicionado à ordem.
   * @returns {Promise<OrderItem>} - O item da ordem adicionado.
   */
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

  /**
   * Remove um item de um pedido existente.
   *
   * @param {string} orderId - ID da ordem da qual o item será removido.
   * @param {string} itemId - ID do item da ordem a ser removido.
   * @returns {Promise<void>}
   */
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

  /**
   * Aplica um desconto ao total de uma ordem.
   *
   * @param {string} id - ID da ordem na qual o desconto será aplicado.
   * @param {number} discount - O valor do desconto a ser aplicado.
   * @returns {Promise<Order>} - A ordem atualizada com o desconto aplicado.
   */
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

  /**
   * Completa um item de pedido, definindo a data de finalização e o status como finalizado.
   * @param id ID do item de pedido a ser atualizado.
   * @returns O item de pedido atualizado.
   * @throws {NotFoundError} Se o item de pedido não for encontrado.
   */
  async completeOrderItem(id: string): Promise<OrderItem> {
    const orderItem = await prisma.orderItem.findUniqueOrThrow({
      where: {
        id,
      },
    })

    const updatedOrderItem = await prisma.orderItem.update({
      where: {
        id: orderItem.id,
      },
      data: {
        finishedAt: new Date(),
        status: 2,
      },
    })

    return updatedOrderItem
  }

  /**
   * Completa um pedido, definindo a data de finalização e o status como finalizado.
   * @param id ID do pedido a ser atualizado.
   * @returns O pedido atualizado.
   * @throws {NotFoundError} Se o pedido não for encontrado.
   * @throws {Error} Se houver um ou mais itens de pedido não finalizados.
   */
  async completeOrder(id: string): Promise<Order> {
    const order = await prisma.order.findFirstOrThrow({
      where: { id },
    })

    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: order.id,
      },
    })

    const orderItemsNotFinished = orderItems.filter(
      (item) => item.finishedAt === null,
    )

    if (orderItemsNotFinished.length > 0) {
      throw new Error('Order not finished')
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 2,
        finishedAt: new Date(),
      },
    })

    return updatedOrder
  }

  /**
   * Busca todos os pedidos, incluindo os seus respectivos itens de pedido.
   * @returns Uma lista de todos os pedidos, com seus itens de pedido.
   */
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

  /**
   * Busca um pedido pelo ID, incluindo seus respectivos itens de pedido.
   * @param id ID do pedido a ser buscado.
   * @returns O pedido encontrado, com seus itens de pedido.
   * @throws {NotFoundError} Se o pedido não for encontrado.
   */
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

  /**
   * Busca todos os pedidos de um determinado cliente, incluindo seus respectivos itens de pedido.
   * @param clientId ID do cliente cujos pedidos devem ser buscados.
   * @returns Uma lista de todos os pedidos do cliente especificado, com seus itens do pedido.
   */
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

  /**
   * Atualiza um pedido existente com os dados fornecidos.
   * @param id ID do pedido a ser atualizado.
   * @param data Novos dados do pedido.
   * @returns O pedido atualizado.
   * @throws {NotFoundError} Se o pedido não for encontrado.
   */
  async update(id: string, data: OrderDTO): Promise<Order> {
    await prisma.order.findFirstOrThrow({
      where: { id },
    })

    return prisma.order.update({
      where: { id },
      data,
    })
  }

  /**
   * Exclui um pedido pelo ID.
   * @param id ID do pedido a ser excluído.
   * @throws {NotFoundError} Se o pedido não for encontrado.
   */
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
