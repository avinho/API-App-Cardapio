import { FastifyInstance } from 'fastify'
import { authUserMidlle } from '../middlewares/authUserMiddle'
import { userController } from '../containers/userContainer'

export async function userRoutes(app: FastifyInstance) {
  app.post('/signup', async (req, res) => {
    return await userController.signUp(req, res)
  })

  app.post('/login', async (req, res) => {
    return await userController.login(req, res)
  })

  app.post('/logout', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.logout(req, res)
  })

  app.post('/admin/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.turnAdmin(req, res)
  })

  app.get('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.findById(req, res)
  })

  app.get('/email/:email', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.findByEmail(req, res)
  })

  app.get('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.findAll(req, res)
  })

  app.put('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.update(req, res)
  })

  app.delete('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await userController.delete(req, res)
  })
}
