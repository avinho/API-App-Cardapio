/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { ProductUseCase } from '../useCases/productUseCase'
import { handleError } from '../utils/errors'
import { findByIdSchema, findByNameSchema } from '../schemas/'
import {
  createProductSchema,
  findByCategorySchema,
} from '../schemas/productSchemas'

export class ProductController {
  constructor(private useCase: ProductUseCase) {}

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { name, price, description, rating, category } =
        await createProductSchema.parseAsync(req.body)

      const product = await this.useCase.create({
        name,
        price,
        description,
        rating,
        category,
      })

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
      const { id } = await findByIdSchema.parseAsync(req.params)

      const product = await this.useCase.findById(id)

      res.status(200).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByName(req: FastifyRequest, res: FastifyReply) {
    try {
      const { name } = await findByNameSchema.parseAsync(req.params)

      const product = await this.useCase.findByName(name)

      res.status(200).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByCategory(req: FastifyRequest, res: FastifyReply) {
    try {
      const { category } = await findByCategorySchema.parseAsync(req.params)

      const result = await this.useCase.findByCategory(category)

      res.status(200).send(result)
    } catch (err) {
      handleError(err, res)
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params)
      const { name, price, description, rating, category } =
        await createProductSchema.parseAsync(req.body)

      const product = await this.useCase.update(id, {
        name,
        price,
        description,
        rating,
        category,
      })

      res.status(200).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params)

      const result = await this.useCase.delete(id)

      res.status(200).send(result)
    } catch (err) {
      handleError(err, res)
    }
  }
}
