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

  /**
   * Cria um novo pedido associado a um determinado cliente.
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns O novo pedido criado.
   */
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

  /**
   * Adiciona um novo item a um pedido existente.
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns O pedido atualizado com o novo item.
   */
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

  /**
   * Remove um item de um pedido existente.
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns uma mensagem de confirmação indicando que o item foi removido com sucesso.
   */
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
  /**
   * Aplica um desconto em um pedido existente.
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns O pedido atualizado com o desconto aplicado.
   */
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

  /**
   * Busca todas as ordens
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns Retorna todos pedidos
   */
  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const order = await this.useCase.findAll()

      res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  /**
   * Busca uma ordem por id
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns Retorna o pedido encontrado pelo id especificado na requisição
   */
  async findById(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = await findByIdSchema.parseAsync(req.params)

      const order = await this.useCase.findById(id)
      res.status(200).send(order)
    } catch (err) {
      handleError(err, res)
    }
  }

  /**
   * Busca todas as ordens de um determinado cliente
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns Retorna todos os pedidos encontrados do cliente especificado na requisição
   */
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
  /**
   * Atualiza uma ordem existente
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns Retorna a ordem atualizada
   */
  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      res.status(200).send()
    } catch (err) {
      handleError(err, res)
    }
  }

  /**
   * Deleta uma ordem existente
   * @param {Object} req - Requisição HTTP recebida pelo servidor
   * @param {Object} res - Resposta HTTP a ser enviada pelo servidor
   * @returns Retorna uma mensagem informando que a ordem foi removida com sucesso
   */
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
