import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "../logger";

function registerDatabaseEventListeners(): void {
  mongoose.connection.on("connected", () => {
    logger.info({
      module: "database",
    },
      "MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn({
      module: "database",
    },
      "MongoDB disconnected");
  });

  mongoose.connection.on("error", (error) => {
    logger.error({
      module: "database",
    },
      "Failed to connect to MongoDB");
  });
}

export async function connectDatabase(): Promise<void> {
  registerDatabaseEventListeners();

  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    logger.error("Failed to connect to MongoDB");
    logger.error(error);

    process.exit(1);
  }
}