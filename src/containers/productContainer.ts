import { ProductRepository } from '../repositories/productRepository'

import { ProductUseCase } from '../useCases/productUseCase'

import { ProductController } from '../controllers/productController'

const productRepository = new ProductRepository()
const productUseCase = new ProductUseCase(productRepository)
export const productController = new ProductController(productUseCase)
