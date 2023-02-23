/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { OrderUseCase } from '../useCases/orderUseCase'
import { handleError } from '../utils/errors'
import { createOrderSchema } from '../schemas/orderSchema'
import { findByIdSchema, subSchema } from '../schemas/'

export class OrderController {
  constructor(private useCase: OrderUseCase) {}

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' })
      }

      const userId = await subSchema.parseAsync(req.user)
      const body = await createOrderSchema.parseAsync(req.body)
      const data = {
        ...body,
        clientId: userId.sub,
      }

      const product = await this.useCase.create(data)

      return res.status(201).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const products = await this.useCase.findAll()

      res.status(200).send(products)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findById(req: FastifyRequest, res: FastifyReply) {
    try {
      const id = req.params as string

      const product = await this.useCase.findById(id)
      res.status(200).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByClientId(req: FastifyRequest, res: FastifyReply) {
    try {
      res.status(200).send()
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
