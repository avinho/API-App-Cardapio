import { prisma } from '../database'
import { Client } from '@prisma/client'
import { ClientDTO } from '../dto/clientDTO'
import { IClientRepository } from '../interfaces/IClientRepository'

class ClientRepository implements IClientRepository {
  async create(data: ClientDTO): Promise<Client> {
    const clientAlreadyExists = await prisma.client.findUnique({
      where: { cpf: data.cpf },
    })

    if (clientAlreadyExists) {
      throw new Error('Client already exists')
    }

    return prisma.client.create({
      data,
    })
  }

  async findAll(): Promise<Client[]> {
    return prisma.client.findMany()
  }

  async findById(id: string): Promise<Client> {
    return prisma.client.findUniqueOrThrow({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<Client> {
    return prisma.client.findUniqueOrThrow({
      where: { email },
    })
  }

  async findByName(name: string): Promise<Client[]> {
    return prisma.client.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    })
  }

  async findByCpf(cpf: string): Promise<Client> {
    return prisma.client.findUniqueOrThrow({
      where: { cpf },
    })
  }

  async update(id: string, data: ClientDTO): Promise<Client> {
    await this.findById(id)

    return prisma.client.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)

    await prisma.client.delete({
      where: { id },
    })
  }
}

export { ClientRepository }
