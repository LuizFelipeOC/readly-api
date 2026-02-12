import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authHook } from "../modules/auth/auth.hook";
import { AuthService } from "../modules/auth/auth.services";
import { AuthController } from "../modules/auth/auth.controller";
import { authenticationRequestSchema, AuthenticationRequest, registrationRequestSchema, RegistrationRequest } from "../modules/auth/auth.schema";
import { rateLimitWrapper } from "../plugins/simpleRateLimit";

export async function authRoutes(fastifyInstance: FastifyInstance) {
    const service = new AuthService()
    const controller = new AuthController(service)

    const authHandler = rateLimitWrapper<{ Body: AuthenticationRequest }>(5, 60_000)(async (request: FastifyRequest<{ Body: AuthenticationRequest }>, reply: FastifyReply) => {
        const parseResult = authenticationRequestSchema.safeParse(request.body)

        if (!parseResult.success) {
            return reply.status(400).send({ message: 'E-mail ou senha do usuário inválidos', issues: parseResult.error.format() })
        }

        return controller.authentication(request, reply)
    })

    fastifyInstance.post<{ Body: AuthenticationRequest }>("/authentication", authHandler);

    const registrationHandler = rateLimitWrapper<{ Body: RegistrationRequest }>(3, 60_000)(async (request: FastifyRequest<{ Body: RegistrationRequest }>, reply: FastifyReply) => {
        const parseResult = registrationRequestSchema.safeParse(request.body)

        if (!parseResult.success) {
            return reply.status(400).send({ message: 'Dados de registro inválidos', issues: parseResult.error.format() })
        }

        return controller.registration(request, reply)
    })

    fastifyInstance.post<{ Body: RegistrationRequest }>("/registration", registrationHandler)

    fastifyInstance.post("/refresh-token", {
        preHandler: authHook
    }, async (request, reply) => { });

    fastifyInstance.delete("/logout", async (request, reply) => { })

    fastifyInstance.post("/password-reset", async (request, reply) => { })
}