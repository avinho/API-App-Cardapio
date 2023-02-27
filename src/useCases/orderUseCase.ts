/* eslint-disable no-useless-constructor */
import { Order, OrderItem } from '@prisma/client'
import { OrderDTO } from '../dto/orderDTO'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { IOrder } from '../interfaces/IOrder'

/**
 * Classe que implementa a lógica de negócio relacionada a pedidos (orders).
 * Utiliza uma instância de OrderRepository para interagir com o banco de dados.
 */
export class OrderUseCase {
  /**
   * Construtor da classe.
   * @param orderRepository Uma instância de OrderRepository, que será utilizada para interagir com o banco de dados.
   */
  constructor(private orderRepository: IOrderRepository) {}

  /**
   * Cria um novo pedido.
   * @param data Um objeto do tipo OrderDTO contendo as informações do pedido a ser criado.
   * @returns Uma Promise que, quando resolvida, retorna o pedido recém-criado (objeto do tipo Order).
   */
  async createOrder(data: OrderDTO): Promise<Order> {
    return await this.orderRepository.createOrder(data)
  }

  /**
   * Adiciona um item a um pedido existente.
   * @param orderId O ID do pedido ao qual o item será adicionado.
   * @param productId O ID do produto que será adicionado ao pedido.
   * @param quantity A quantidade do produto a ser adicionado.
   * @returns Uma Promise que, quando resolvida, retorna o item do pedido que foi adicionado (objeto do tipo OrderItem).
   */
  async addItem(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem> {
    return await this.orderRepository.addItem(orderId, productId, quantity)
  }

  /**
   * Remove um item de um pedido existente.
   * @param orderId O ID do pedido do qual o item será removido.
   * @param itemId O ID do item que será removido.
   * @returns Uma Promise que, quando resolvida, não retorna nenhum valor.
   */
  async removeItem(orderId: string, itemId: string): Promise<void> {
    return await this.orderRepository.removeItem(orderId, itemId)
  }

  /**
   * Aplica um desconto a um pedido existente.
   * @param orderId O ID do pedido ao qual o desconto será aplicado.
   * @param discount O valor do desconto a ser aplicado.
   * @returns Uma Promise que, quando resolvida, retorna o pedido com o desconto aplicado (objeto do tipo Order).
   */
  async discount(orderId: string, discount: number): Promise<Order> {
    return await this.orderRepository.discount(orderId, discount)
  }

  /**
   * Retorna uma lista com todos os pedidos.
   * @returns Uma Promise que, quando resolvida, retorna um array contendo todos os pedidos cadastrados (objetos do tipo Order).
   */
  async findAll(): Promise<any[]> {
    return await this.orderRepository.findAll()
  }

  /**
   * Busca um pedido pelo seu ID.
   * @param id O ID do pedido a ser buscado.
   * @returns Uma Promise que, quando resolvida, retorna o pedido encontrado (objeto do tipo IOrder).
   */
  async findById(id: string): Promise<IOrder> {
    return await this.orderRepository.findById(id)
  }

  /**
   * Busca todos os pedidos relacionados a um determinado cliente.
   * @param clientId O ID do cliente cujos pedidos serão buscados.
   * @returns Uma Promise que, quando resolvida, retorna um array contendo todos os pedidos relacionados ao cliente (objetos do tipo Order).
   */
  async findByClientId(clientId: string): Promise<Order[]> {
    return await this.orderRepository.findByClientId(clientId)
  }

  /**
   * Atualiza as informações de um pedido existente.
   * @param id O ID do pedido a ser atualizado.
   * @param data Um objeto do tipo OrderDTO contendo as novas informações do pedido.
   * @returns Uma Promise que, quando resolvida, retorna o pedido atualizado (objeto do tipo Order).
   */
  async update(id: string, data: OrderDTO): Promise<Order> {
    return await this.orderRepository.update(id, data)
  }

  /**
   * Deleta um pedido existente.
   * @param id O ID do pedido a ser deletado.
   * @returns Uma Promise que, quando resolvida, não retorna nenhum valor.
   */
  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.deleteOrder(id)
  }
}
