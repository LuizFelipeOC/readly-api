import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

export default fp(async (app: FastifyInstance) => {
    app.decorate(
        'authenticate',
        async (request: any, reply: any) => {
            try {
                await request.jwtVerify()

                request.user = {
                    id: request.user.sub,
                    email: request.user.email,
                }
            } catch (err) {
                reply.status(401).send({ message: 'Unauthorized' })
            }
        }
    )
})
