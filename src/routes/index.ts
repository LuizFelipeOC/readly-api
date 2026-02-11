import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'
import jwt from '../modules/plugins/jwt'

export async function registerRoutes(app: FastifyInstance) {
    app.register(jwt)
    await app.register(authRoutes, { prefix: '/auth' })
}
