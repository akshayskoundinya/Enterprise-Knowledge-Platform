import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database";
import { logger } from "./logger";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.EXPRESS_PORT, () => {
    logger.info(`Server running on port ${env.EXPRESS_PORT}`);
  });
}

bootstrap();