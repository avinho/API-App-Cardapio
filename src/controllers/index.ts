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
const userUseCase = new UserUseCase(userRepository)
export const userController = new UserController(userUseCase)

const clientRepository = new ClientRepository()
const clientUseCase = new ClientUseCase(clientRepository)
export const clientController = new ClientController(clientUseCase)

const productRepository = new ProductRepository()
const productUseCase = new ProductUseCase(productRepository)
export const productController = new ProductController(productUseCase)

const orderRepository = new OrderRepository()
const orderUseCase = new OrderUseCase(orderRepository)
export const orderController = new OrderController(orderUseCase)
