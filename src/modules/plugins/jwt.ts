import { FastifyInstance } from "fastify"
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (fastify: FastifyInstance) => {
    fastify.register(jwt, {
        secret: process.env.SUPABASE_JWT_SECRET!,
    });
});