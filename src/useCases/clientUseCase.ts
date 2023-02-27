/* eslint-disable no-useless-constructor */
import { IClientRepository } from '../interfaces/IClientRepository'
import { ILogin } from '../interfaces/ILogin'
import { ClientDTO } from '../dto/clientDTO'
import { Client } from '@prisma/client'
import { blacklist } from '../middlewares/authUserMiddle'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { env } from '../env'

/**
 * Classe que implementa a lógica de negócio relacionada a clientes.
 * Utiliza uma instância de ClientRepository para interagir com o banco de dados.
 */
class ClientUseCase {
  /**
   * Cria uma instância da classe ClientUseCase
   * @param {clientRepository} clientRepository - Uma instância do repositório do cliente
   */
  constructor(private clientRepository: IClientRepository) {}

  /**
   * Cria um novo cliente
   * @param {string} name - O nome do cliente
   * @param {string} cpf - O CPF do cliente
   * @param {string} password - A senha do cliente
   * @param {string} phone - O telefone do cliente
   * @param {string} birthday - A data de nascimento do cliente
   * @param {string} email - O email do cliente
   * @returns {Promise<Client>} Uma Promise que, quando resolvida, retorna os dados do cliente recém-criado/registrado (objeto do tipo Cliente).
   */
  async signUp({
    name,
    cpf,
    password,
    phone,
    birthday,
    email,
  }: ClientDTO): Promise<Client> {
    const passHash = await hash(password, 8)
    const user = {
      name,
      cpf,
      password: passHash,
      phone,
      birthday,
      email,
    }
    return await this.clientRepository.create(user)
  }

  /**
   * Autentica um cliente
   * @param {string} email - O email do cliente
   * @param {string} password - A senha do cliente
   * @returns {Promise<string>} Uma Promise que quando resolvida, retorna um token JWT
   * @throws {Error} Se as credenciais estiverem incorretas ou ocorrer um erro ao gerar o token
   */
  async login({ email, password }: ILogin): Promise<string> {
    const client = await this.clientRepository.findByEmail(email)

    const passMatch = await compare(password, client.password)

    if (!passMatch) {
      throw new Error('Email/Password incorrect')
    }

    try {
      const token = sign({ email }, env.JWT_SECRET, {
        subject: client.id,
        expiresIn: '1d',
        issuer: env.JWT_ISSUER,
      })

      return token
    } catch (error) {
      throw new Error('Error generating token')
    }
  }

  /**
   * Realiza o logout de um cliente
   * @param {string} token - O token JWT do cliente
   * @returns {Promise<Object>} Uma Promise que quando resolvida, retornar um objeto que contém a mensagem de sucesso do logout
   */
  async logout(token: string): Promise<Object> {
    blacklist.add(token)
    return { message: '✅ Logout success!' }
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.findAll()
  }

  async findById(id: string): Promise<Client> {
    return await this.clientRepository.findById(id)
  }

  async findByName(name: string): Promise<Client[]> {
    return await this.clientRepository.findByName(name)
  }

  async findByCpf(cpf: string): Promise<Client> {
    return await this.clientRepository.findByCpf(cpf)
  }

  async findByEmail(email: string): Promise<Client> {
    return await this.clientRepository.findByEmail(email)
  }

  async update(id: string, data: ClientDTO): Promise<Client> {
    return await this.clientRepository.update(id, data)
  }

  async delete(id: string): Promise<Object> {
    await this.clientRepository.delete(id)

    return { message: 'Client deleted' }
  }
}

export { ClientUseCase }
