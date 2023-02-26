import { OrderRepository } from '../repositories/orderRepository'
import { OrderUseCase } from '../useCases/orderUseCase'
import { OrderController } from '../controllers/orderController'

const orderRepository = new OrderRepository()
const orderUseCase = new OrderUseCase(orderRepository)
export const orderController = new OrderController(orderUseCase)
