import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import sensible from '@fastify/sensible'
import { env } from './env'
import { routes } from './routes'

const app = fastify()

app.register(cors)
app.register(sensible)
app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
    iss: env.JWT_ISSUER,
  },
})

routes.forEach((route) => {
  app.register(route.routes, { prefix: route.path })
})

export default app
