import { app } from "./app";
import { registerRoutes } from "./routes";

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }

    app.log.info(`Server listening at ${address}`);
});