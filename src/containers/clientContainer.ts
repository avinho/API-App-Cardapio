import { ClientRepository } from '../repositories/clientRepository'
import { ClientUseCase } from '../useCases/clientUseCase'
import { ClientController } from '../controllers/clientController'

const clientRepository = new ClientRepository()
const clientUseCase = new ClientUseCase(clientRepository)
export const clientController = new ClientController(clientUseCase)
