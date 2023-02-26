import { UserRepository } from '../repositories/userRepository'
import { UserUseCase } from '../useCases/userUseCase'
import { UserController } from '../controllers/userController'

const userRepository = new UserRepository()
const userUseCase = new UserUseCase(userRepository)
export const userController = new UserController(userUseCase)
