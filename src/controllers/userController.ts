/* eslint-disable no-useless-constructor */
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createUserSchema,
  findByEmailSchema,
  findByIdSchema,
  loginSchema,
} from '../schemas/userSchemas'
import { handleError } from '../utils/errors'
import { UserUseCase } from '../useCases/userUseCase'
import { userController } from './index'

class UserController {
  constructor(private useCase: UserUseCase) {}

  async signUp(req: FastifyRequest, res: FastifyReply) {
    try {
      const data = await createUserSchema.parseAsync(req.body)
      console.log(userController)
      const user = await this.useCase.signUp(data)

      res.status(201).send(user)
    } catch (err) {
      handleError(err, res)
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    try {
      const { email, password } = loginSchema.parse(req.body)

      const token = await this.useCase.login({ email, password })

      res.status(200).send(token)
    } catch (err: any) {
      handleError(err, res)
    }
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    try {
      const token = req.headers.authorization as string
      await this.useCase.logout(token)

      res.status(200).send({ message: '✅ Logout successful!' })
    } catch (err: any) {
      handleError(err, res)
    }
  }

  async turnAdmin(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = findByIdSchema.parse(req.params)

      const result = await this.useCase.turnAdmin(id)

      res.status(200).send(result)
    } catch (err: any) {
      handleError(err, res)
    }
  }

  async findById(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = findByIdSchema.parse(req.params)

      const user = await this.useCase.findById(id)

      res.status(200).send(user)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findByEmail(req: FastifyRequest, res: FastifyReply) {
    try {
      const { email } = findByEmailSchema.parse(req.params)

      const user = await this.useCase.findByEmail(email)

      res.status(200).send(user)
    } catch (err) {
      handleError(err, res)
    }
  }

  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const users = await this.useCase.findAll()

      res.status(200).send(users)
    } catch (err) {
      handleError(err, res)
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = findByIdSchema.parse(req.params)
      const userData = createUserSchema.parse(req.body)

      const user = await this.useCase.update(id, userData)

      res.status(200).send(user)
    } catch (err: any) {
      handleError(err, res)
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = findByIdSchema.parse(req.params)

      const user = await this.useCase.delete(id)

      res.status(200).send(user)
    } catch (err) {
      handleError(err, res)
    }
  }
}

export { UserController }
