/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { OrderUseCase } from '../useCases/orderUseCase'
import { handleError } from '../utils/errors'
import {
  addItemSchema,
  createOrderSchema,
  discountSchema,
  findByItemIdSchema,
} from '../schemas/orderSchema'
import { findByIdSchema, subSchema } from '../schemas/'

export class OrderController {
  constructor(private useCase: OrderUseCase) {}

  async createOrder(req: FastifyRequest, res: FastifyReply) {
    try {
      const { sub } = await subSchema.parseAsync(req.user) // Client id from token

      const body = await createOrderSchema.parseAsync(req.body) // Order data

      const data = {
        ...body,
        clientId: sub,
      }

      const order = await this.useCase.createOrder(data)

      return res.status(201).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async addItem(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params) // Order id

      const { productId, quantity } = await addItemSchema.parseAsync(req.body)

      const order = await this.useCase.addItem(id, productId, quantity)

      return res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async removeItem(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params) // Order id

      const { itemId } = await findByItemIdSchema.parseAsync(req.body) // Item id

      await this.useCase.removeItem(id, itemId)

      return res.status(200).send({ message: '✅ Item removed!' })
    } catch (err) {
      handleError(err, res)
    }
  }

  // TODO - Melhorar a aplicação do desconto do pedido
  async discount(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params) // Order id

      const { discount } = await discountSchema.parseAsync(req.body) // Discount

      const order = await this.useCase.discount(id, discount)

      res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const order = await this.useCase.findAll()

      res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findById(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params)

      const order = await this.useCase.findById(id)
      res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByClientId(req: FastifyRequest, res: FastifyReply) {
    try {
      const { sub } = await subSchema.parseAsync(req.user)

      const orders = await this.useCase.findByClientId(sub)

      res.status(200).send(orders)
    } catch (err) {
      handleError(err, res)
    }
  }

  // TODO - Implementar o update do pedido
  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      res.status(200).send()
    } catch (err) {
      handleError(err, res)
    }
  }

  async deleteOrder(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params) // Order id

      await this.useCase.deleteOrder(id)

      return res.status(200).send({ message: '✅ Order removed!' })
    } catch (err) {
      handleError(err, res)
    }
  }
}
