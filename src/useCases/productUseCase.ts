/* eslint-disable no-useless-constructor */
import { ProductDTO } from '../dto/productDTO'
import { Products } from '@prisma/client'
import { IProductRepository } from '../interfaces/IProductRepository'

class ProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async create(data: ProductDTO): Promise<Products> {
    return await this.productRepository.create(data)
  }

  async findAll(): Promise<Products[]> {
    return await this.productRepository.findAll()
  }

  async findById(id: string): Promise<Products> {
    return await this.productRepository.findById(id)
  }

  async findByName(name: string): Promise<Products[]> {
    return await this.productRepository.findByName(name)
  }

  async findByCategory(category: string): Promise<Products[]> {
    return await this.productRepository.findByCategory(category)
  }

  async update(id: string, data: ProductDTO): Promise<Products> {
    return await this.productRepository.update(id, data)
  }

  async delete(id: string): Promise<Object> {
    await this.productRepository.delete(id)

    return { message: 'Product deleted' }
  }
}

export { ProductUseCase }
