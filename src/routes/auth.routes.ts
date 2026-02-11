import { FastifyInstance } from "fastify";
import { authHook } from "../modules/auth/auth.hook";
import { AuthService } from "../modules/auth/auth.services";
import { AuthController } from "../modules/auth/auth.controller";
import { authenticationRequestSchema, AuthenticationRequest } from "../modules/auth/auth.schema";

export async function authRoutes(fastifyInstance: FastifyInstance) {
    const service = new AuthService()
    const controller = new AuthController(service)

    fastifyInstance.post<{ Body: AuthenticationRequest }>(
        "/authentication",
        async (request, reply) => {
            const parseResult = authenticationRequestSchema.safeParse(request.body)

            if (!parseResult.success) {
                return reply.status(400).send({ message: 'E-mail ou senha do usuário inválidos', issues: parseResult.error.format() })
            }

            return controller.authentication(request, reply)
        }
    );

    fastifyInstance.post("/registration", async (request, reply) => { })

    fastifyInstance.post("/refresh-token", {
        preHandler: authHook
    }, async (request, reply) => { });

    fastifyInstance.delete("/logout", async (request, reply) => { })

    fastifyInstance.post("/password-reset", async (request, reply) => { })
}