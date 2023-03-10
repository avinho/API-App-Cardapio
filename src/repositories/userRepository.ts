import { prisma } from '../database'
import { User } from '@prisma/client'
import { UserDTO } from '../dto/userDTO'
import { IUserRepository } from '../interfaces/IUserRepository'

class UserRepository implements IUserRepository {
  async create({ name, email, password }: UserDTO): Promise<User> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    return prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }

  async turnAdmin(id: string): Promise<void> {
    await this.findById(id)

    await prisma.user.update({
      where: { id },
      data: {
        admin: true,
      },
    })
  }

  async findById(id: string): Promise<User> {
    return prisma.user.findUniqueOrThrow({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<User> {
    return prisma.user.findUniqueOrThrow({
      where: { email },
    })
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany()
  }

  async update(id: string, data: UserDTO): Promise<User> {
    await this.findById(id)

    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)

    await prisma.user.delete({
      where: { id },
    })
  }
}

export { UserRepository }
