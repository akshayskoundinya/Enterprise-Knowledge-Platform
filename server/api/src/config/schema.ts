import { z } from "zod";

export const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Express
  EXPRESS_PORT: z.coerce.number().int().positive(),

  // MongoDB
  MONGODB_URI: z.url(),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_EXPIRES_IN: z.string(),

  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
});