import { FastifyInstance } from 'fastify'
import { authUserMidlle } from '../middlewares/authUserMiddle'
import { clientController } from '../containers/clientContainer'

export async function clientRoutes(app: FastifyInstance) {
  app.get('/test', async (req, res) => {
    return res.send({ hello: 'world' })
  })

  app.post('/signup', async (req, res) => {
    return await clientController.signUp(req, res)
  })

  app.post('/login', async (req, res) => {
    return await clientController.login(req, res)
  })

  app.post('/logout', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.logout(req, res)
  })

  app.get('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.findAll(req, res)
  })

  app.get('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.findById(req, res)
  })

  app.get('/name/:name', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.findByName(req, res)
  })
  app.get('/email/:email', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.findByEmail(req, res)
  })
  app.get('/cpf/:cpf', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.findByCpf(req, res)
  })
  app.put('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.update(req, res)
  })
  app.delete('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await clientController.delete(req, res)
  })
}
