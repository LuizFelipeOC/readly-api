import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'
import jwt from '../modules/plugins/jwt'
import auth from '../modules/plugins/auth'


console.log('JWT SECRET:', process.env.SUPABASE_JWT_SECRET)


export async function registerRoutes(app: FastifyInstance) {
    app.register(jwt)
    app.register(auth)

    await app.register(authRoutes)
}
