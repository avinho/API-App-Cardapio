import { userRoutes } from './user.routes'
import { productRoutes } from './product.routes'
import { clientRoutes } from './client.routes'
import { orderRoutes } from './order.routes'

export const routes = [
  { path: '/api/users', routes: userRoutes },
  { path: '/api/products', routes: productRoutes },
  { path: '/api/clients', routes: clientRoutes },
  { path: '/api/orders', routes: orderRoutes },
]
