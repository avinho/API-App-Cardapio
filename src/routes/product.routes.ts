import { FastifyInstance } from 'fastify'
import { authUserMidlle } from '../middlewares/authUserMiddle'
import { productController } from '../containers/productContainer'

export async function productRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.create(req, res)
  })

  app.get('/', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.findAll(req, res)
  })

  app.get('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.findById(req, res)
  })

  app.get('/name/:name', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.findByName(req, res)
  })

  app.get(
    '/category/:category',
    { preHandler: authUserMidlle },
    async (req, res) => {
      return await productController.findByCategory(req, res)
    },
  )

  app.put('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.update(req, res)
  })

  app.delete('/:id', { preHandler: authUserMidlle }, async (req, res) => {
    return await productController.delete(req, res)
  })
}
