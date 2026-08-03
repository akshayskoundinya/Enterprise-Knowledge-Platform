import dotenv from "dotenv";

dotenv.config();

export const env = {
    API_PORT: Number(process.env.API_PORT) || 3000,
};