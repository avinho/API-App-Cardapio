import { UserRepository } from '../repositories/userRepository'
import { ClientRepository } from '../repositories/clientRepository'
import { ProductRepository } from '../repositories/productRepository'
import { OrderRepository } from '../repositories/orderRepository'
import { UserUseCase } from '../useCases/userUseCase'
import { ClientUseCase } from '../useCases/clientUseCase'
import { ProductUseCase } from '../useCases/productUseCase'
import { OrderUseCase } from '../useCases/orderUseCase'
import { UserController } from './userController'
import { ClientController } from './clientController'
import { ProductController } from './productController'
import { OrderController } from './orderController'

const userRepository = new UserRepository()
const clientRepository = new ClientRepository()
const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()

const userUseCase = new UserUseCase(userRepository)
const clientUseCase = new ClientUseCase(clientRepository)
const productUseCase = new ProductUseCase(productRepository)
const orderUseCase = new OrderUseCase(orderRepository)

export const userController = new UserController(userUseCase)
export const clientController = new ClientController(clientUseCase)
export const productController = new ProductController(productUseCase)
export const orderController = new OrderController(orderUseCase)
