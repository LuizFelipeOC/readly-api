import { FastifyInstance } from "fastify";

export async function authRoutes(fastifyInstance: FastifyInstance) {
    fastifyInstance.post("/authentication", async (request, reply) => { })
    fastifyInstance.post("/registration", async (request, reply) => { })
    fastifyInstance.post("/refresh-token", async (request, reply) => { })
    fastifyInstance.delete("/logout", async (request, reply) => { })
    fastifyInstance.post("/password-reset", async (request, reply) => { })
}