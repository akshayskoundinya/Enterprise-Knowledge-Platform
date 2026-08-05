import { z } from "zod";
import dotenv from "dotenv";
import { envSchema } from "./schema";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:");
    console.error(z.treeifyError(parsedEnv.error));

    process.exit(1);
}

export const env = parsedEnv.data;