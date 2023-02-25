import { FastifyInstance } from 'fastify'
import { authUserMidlle } from '../middlewares/authUserMiddle'
import { orderController } from '../controllers'

export async function orderRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.createOrder(req, res)
  })

  app.get('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.findAll(req, res)
  })

  app.get('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.findById(req, res)
  })

  app.post('/:id/itens', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.addItem(req, res)
  })

  app.delete('/:id/itens', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.removeItem(req, res)
  })

  app.patch(
    '/:id/discount',
    { preHandler: authUserMidlle },
    async (req, res) => {
      return await orderController.discount(req, res)
    },
  )

  app.get(
    '/client/:clientId',
    { preHandler: authUserMidlle },
    async (req, res) => {
      return await orderController.findByClientId(req, res)
    },
  )
  app.patch('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.update(req, res)
  })

  app.delete('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await orderController.deleteOrder(req, res)
  })
}
