import dotenv from "dotenv";
import { logger } from "../logger";
import { envSchema } from "./schema";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:");
    console.error(parsedEnv.error.flatten().fieldErrors);

    process.exit(1);
}

export const env = parsedEnv.data;