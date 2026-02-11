import './config/env'
import fastify from "fastify";
import { registerRoutes } from "./routes";
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const app = fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

registerRoutes(app);


