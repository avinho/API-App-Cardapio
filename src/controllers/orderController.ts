/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { OrderUseCase } from '../useCases/orderUseCase'
import { handleError } from '../utils/errors'
import { addItemSchema, createOrderSchema } from '../schemas/orderSchema'
import { findByIdSchema, subSchema } from '../schemas/'

export class OrderController {
  constructor(private useCase: OrderUseCase) {}

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { sub } = await subSchema.parseAsync(req.user)

      const body = await createOrderSchema.parseAsync(req.body)

      const data = {
        ...body,
        clientId: sub,
      }

      const order = await this.useCase.create(data)

      return res.status(201).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  async addItem(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params) // Order id

      const { productId, quantity } = await addItemSchema.parseAsync(req.body) // Product id

      const order = await this.useCase.addItem(id, productId, quantity)

      return res.status(201).send(order)
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

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      res.status(200).send()
    } catch (err) {
      handleError(err, res)
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      res.status(200).send()
    } catch (err) {
      handleError(err, res)
    }
  }
}
