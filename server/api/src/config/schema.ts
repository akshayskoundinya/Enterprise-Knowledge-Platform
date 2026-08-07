import { z } from "zod";
import type { StringValue } from "ms";

export const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Express
  EXPRESS_PORT: z.coerce.number().int().positive(),

  // MongoDB
  MONGODB_URI: z.url(),

  // Authentication
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),

  ACCESS_TOKEN_EXPIRES_IN: z.custom<StringValue>(
    (value) => typeof value === "string",
    {
      message: "Invalid ACCESS_TOKEN_EXPIRES_IN",
    }
  ),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),

  REFRESH_TOKEN_EXPIRES_IN: z.custom<StringValue>(
    (value) => typeof value === "string",
    {
      message: "Invalid REFRESH_TOKEN_EXPIRES_IN",
    }
  ),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),

  //Default Admin
  DEFAULT_ADMIN_EMAIL: z
    .email()
    .default("admin@example.com"),

  DEFAULT_ADMIN_PASSWORD: z
    .string()
    .min(8),
});