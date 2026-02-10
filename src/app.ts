import fastify from "fastify";
import { registerRoutes } from "./routes";

export const app = fastify({
    logger: true,
});

registerRoutes(app);

