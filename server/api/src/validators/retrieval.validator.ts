import { z } from "zod";

export const retrievalSearchSchema = z.object({
    query: z
        .string()
        .trim()
        .min(1)
        .max(2000),

    topK: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(5),
});