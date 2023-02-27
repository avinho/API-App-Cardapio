/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import { ClientUseCase } from '../useCases/clientUseCase'
import { handleError } from '../utils/errors'
import { createClientSchema } from '../schemas/clientSchemas'
import {
  loginSchema,
  findByIdSchema,
  findByCpfSchema,
  findByEmailSchema,
  findByNameSchema,
} from '../schemas/'

export class ClientController {
  constructor(private readonly useCase: ClientUseCase) {}
  async signUp(req: FastifyRequest, res: FastifyReply) {
    try {
      const data = await createClientSchema.parseAsync(req.body)

      const product = await this.useCase.signUp(data)

      return res.status(201).send(product)
    } catch (err) {
      handleError(err, res)
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    try {
      const { email, password } = await loginSchema.parseAsync(req.body)

      const token = await this.useCase.login({
        email,
        password,
      })

      return res.status(201).send(token)
    } catch (err) {
      handleError(err, res)
    }
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    try {
      const token = req.headers.authorization as string
      const result = await this.useCase.logout(token)

      res.status(200).send(result)
    } catch (err: any) {
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

  async findByEmail(req: FastifyRequest, res: FastifyReply) {
    try {
      const { email } = await findByEmailSchema.parseAsync(req.params)

      const result = await this.useCase.findByEmail(email)

      res.status(200).send(result)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByCpf(req: FastifyRequest, res: FastifyReply) {
    try {
      const { cpf } = await findByCpfSchema.parseAsync(req.params)

      const result = await this.useCase.findByCpf(cpf)

      res.status(200).send(result)
    } catch (err) {
      handleError(err, res)
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params)
      const { name, cpf, email, password, phone, birthday } =
        await createClientSchema.parseAsync(req.body)

      const product = await this.useCase.update(id, {
        name,
        cpf,
        email,
        password,
        phone,
        birthday,
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
