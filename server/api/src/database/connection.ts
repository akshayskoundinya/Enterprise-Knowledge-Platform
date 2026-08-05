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
    logger.error(
      {
        module: "database",
        err: error,
      },
      "MongoDB connection error"
    );
  });
}

export async function connectDatabase(): Promise<void> {
  registerDatabaseEventListeners();

  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    logger.error(
      {
        module: "database",
        err: error,
      },
      "Failed to connect to MongoDB"
    );

    process.exit(1);
  }
}